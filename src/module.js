import glob from "fast-glob";
import esbuild from "esbuild";
import jsxRuntime from "@uppercod/esbuild-jsx-runtime";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";
import { getValueIndentation } from "@uppercod/indentation";
import pluginMetaUrl from "@uppercod/esbuild-meta-url";
import { pluginExternals } from "./plugin-externals.js";
import { loadCss } from "./load-css.js";
import { analyzer } from "./analyzer.js";
import {
    isJs,
    setPkgExports,
    setPkgDependencies,
    setPkgTypesVersions,
} from "./utils.js";
import { TS_CONFIG } from "./constants.js";

const pexec = promisify(exec);

const assets = [
    "jpg",
    "svg",
    "png",
    "gif",
    "mp4",
    "webp",
    "jpeg",
    "ico",
    "mp3",
    "eot",
    "woff2",
    "woff",
    "ttf",
    "pdf",
    "ogg",
    "ogv",
    "ogm",
    "md",
];

function logger(message) {
    const date = new Date();
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((value) => (value > 9 ? value : "0" + value))
        .join(":");
    console.log(`[${time}] ${message}`);
}

/**
 * @param {object} config
 * @param {string} config.src
 * @param {string} config.dest
 * @param {boolean} [config.types]
 * @param {boolean} [config.minify]
 * @param {boolean} [config.watch]
 * @param {boolean} [config.exports]
 * @param {boolean} [config.sourcemap]
 * @param {boolean} [config.format]
 * @param {boolean} [config.ignoreBuild]
 * @param {string} [config.main]
 * @param {string} [config.workspace]
 * @param {string[]} [config.target]
 * @param {string[]} [config.metaUrl]
 * @param {(config:import("esbuild").BuildOptions)=>import("esbuild").BuildOptions} [config.preload]
 * @returns
 */
export async function prepare(config) {
    console.log("\nExports");
    logger("Initializing...");
    //@ts-ignore
    let entryPoints = await glob(config.src, {
        ignore: ["**/*.{test,spec}.{js,jsx,ts,tsx,mjs}"],
    });

    const pkgRootSrc = process.cwd() + "/package.json";
    const [pkg, pkgText] = await getJson(pkgRootSrc);

    const external = getExternal(pkg);

    if (config.workspace) {
        (
            await Promise.all(
                (
                    await glob(
                        config.workspace +
                            (config.workspace.endsWith("package.json")
                                ? ""
                                : (config.workspace.endsWith("/") ? "" : "/") +
                                  "package.json")
                    )
                ).map((file) => getJson(file))
            )
        ).forEach(([pkg]) => getExternal(pkg, external));
    }

    const metaUrl = (config.metaUrl || [])
        .concat(assets)
        .reduce((metaUrl, key) => {
            metaUrl[key] = true;
            return metaUrl;
        }, {});

    metaUrl.css = loadCss;

    if (!entryPoints.length) {
        return logger("No file input!");
    }

    const externalKeys = Object.keys(external);

    if (config.exports || config.types) {
        const [exportsJs, exportsCss, exportsTs] = await analyzer({
            pkgName: pkg.name,
            dest: config.dest,
            entryPoints,
            types: config.types,
            exports: config.exports,
        });

        setPkgExports(pkg, exportsJs);
        setPkgExports(pkg, exportsCss);
        setPkgTypesVersions(pkg, exportsTs);
        setPkgDependencies(
            pkg,
            {
                "@atomico/react": "latest",
            },
            "peerDependencies"
        );
        setPkgDependencies(
            pkg,
            {
                "@atomico/react": {
                    optional: true,
                },
            },
            "peerDependenciesMeta"
        );
    }
    /**
     * @type {import("esbuild").BuildOptions}
     */
    const build = {
        entryPoints,
        outdir: config.dest,
        jsxFactory: "_jsx",
        sourcemap: config.sourcemap,
        metafile: true,
        minify: config.minify,
        bundle: true,
        format: config.format || "esm",
        splitting: true,
        external: externalKeys,
        watch: config.watch
            ? {
                  onRebuild(error) {
                      logger(
                          error
                              ? "watch build failed:"
                              : "waiting for changes..."
                      );
                  },
              }
            : null,
        loader: {},
        plugins: [
            pluginMetaUrl(metaUrl),
            jsxRuntime({
                jsxFragment: `"host"`,
                inject: `import { h as _jsx } from "atomico";`,
            }),
            pluginExternals(externalKeys),
        ],
    };

    if (config.target) build.target = config.target;

    /**@type {string[]} */
    let outputs = entryPoints;

    if (!config.ignoreBuild) {
        logger("Generating outputs with esbuild...");

        // build.entryPoints.map(async (entry) => {
        //     const content = await readFile(entry, "utf-8");

        // });

        const { metafile } = await esbuild.build(
            config.preload ? config.preload(build) : build
        );

        outputs = Object.keys(metafile.outputs).filter(
            (output) => !/chunk-(\S+)\.js$/.test(output)
        );

        logger("Esbuild completed...");
    }

    // outputs = [...outputs, ...outputsReactWrapper, ...outputsCssVisibility];
    // entryPoints = [...entryPoints, ...outputsReactWrapper];

    if (config.watch) {
        logger("waiting for changes...");
    } else {
        if (config.exports || config.workspace || config.types) {
            config.exports && setPkgExports(pkg, outputs, config.main);
            config.workspace && setPkgDependencies(pkg, external);

            logger("Preparing package.json...");

            const entriesJs = entryPoints.filter(isJs);

            if (config.types && entriesJs.length) {
                logger("Preparing types...");

                await generateTypes(entriesJs, pkg, config.main);

                logger("Finished types!");
            }

            logger("Finished package.json!");
        }

        logger("completed!");
    }

    const [, space] = pkgText.match(/^(\s+)"/m);

    await writeFile(
        pkgRootSrc,
        JSON.stringify(
            pkg,
            null,
            getValueIndentation(space) / getValueIndentation(" ")
        )
    );
}

/**
 * Read a json document
 * @param {string} file
 * @returns {Promise<{[prop:string]:any}>}
 */
async function getJson(file) {
    const text = await readFile(file, "utf-8");
    return [JSON.parse(text), text];
}

/**
 * Get external files not to be included in the build
 * @param {{[prop:string]:any}} pkg
 * @param {{[prop:string]:Set<string>}} external
 * @returns {{[prop:string]:Set<string>}}
 */
function getExternal(pkg, external = {}) {
    const { dependencies } = pkg;
    for (const prop in dependencies) {
        external[prop] = external[prop] || new Set();
        external[prop].add(dependencies[prop]);
    }
    return external;
}

/**
 *
 * @param {string[]} entryPoints
 */
async function generateTypes(entryPoints, pkg, main) {
    const serialieCommand = Object.entries(TS_CONFIG).reduce(
        (command, [index, value]) => command + ` --${index} ${value}`,
        ""
    );

    const expectTsd = entryPoints.map((entry) => path.parse(entry).name);

    const { stdout } = await pexec(
        `npx tsc ${entryPoints.join(" ")} ${serialieCommand}`
    );

    const exportsTs = stdout
        .split(/\n/)
        .filter((file) => file.startsWith("TSFILE:"))
        .map((line) => {
            const file = path
                .relative(process.cwd(), line.replace(/^TSFILE:\s+/, "").trim())
                .replace(/\\/g, "/");
            return [file, path.parse(file).name.replace(/\.d$/, "")];
        })
        .filter(([, name]) => expectTsd.includes(name))
        .map(([file]) => file);

    setPkgTypesVersions(pkg, exportsTs, main);
}
