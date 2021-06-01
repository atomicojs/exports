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
import { analize } from "./analize.js";

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
 * @param {boolean} [config.reactWrapper]
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
        ignore: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    });

    const pkgRootSrc = process.cwd() + "/package.json";
    const [pkg, pkgText] = await getJson(pkgRootSrc);

    const external = getExternal(pkg);

    if (config.workspace) {
        (
            await Promise.all(
                (await glob(config.workspace)).map((file) => getJson(file))
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

        if (config.reactWrapper) {
            const outputsReactWrapper = await analize(outputs);
            outputs = [...outputs, ...outputsReactWrapper];
            entryPoints = [...entryPoints, outputsReactWrapper];
        }

        logger("Esbuild completed...");
    }

    if (config.watch) {
        logger("waiting for changes...");
    } else {
        if (config.exports || config.workspace || config.types) {
            config.exports && setPkgExports(pkg, outputs, config.main);
            config.workspace && setPkgDependencies(pkg, external);

            logger("Preparing package.json...");

            const [, space] = pkgText.match(/^(\s+)"/m);

            if (config.types) {
                logger("Preparing types...");

                await generateTypes(entryPoints, pkg, config.main);

                logger("Finished types!");
            }

            await writeFile(
                pkgRootSrc,
                JSON.stringify(
                    pkg,
                    null,
                    getValueIndentation(space) / getValueIndentation(" ")
                )
            );

            logger("Finished package.json!");
        }

        logger("completed!");
    }
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

function setPkgDependencies(pkg, external) {
    const { dependencies = {} } = pkg;
    for (const prop in external) {
        if (!dependencies[prop]) {
            const [first] = [...external[prop]];
            dependencies[prop] = first;
        }
    }
    pkg.dependencies = dependencies;
}
/**
 * @param {object} pkg
 * @param {string[]} outputs
 */
async function setPkgExports(pkg, outputs, main) {
    pkg.exports = outputs
        .filter((output) => /\.[jt]sx{0,1}$/.test(output))
        .reduce(
            (exports, output) => {
                const { name } = path.parse(output);
                const prop = name == main ? "." : "./" + name;
                return {
                    ...exports,
                    [prop]: "./" + output,
                };
            },
            {
                ...pkg.exports,
            }
        );
}
/**
 *
 * @param {string[]} entryPoints
 */
async function generateTypes(entryPoints, pkg, main) {
    const serialieCommand = Object.entries({
        moduleResolution: "Node",
        target: "ESNext",
        listEmittedFiles: true,
        strict: true,
        jsx: "react-jsx",
        jsxImportSource: "atomico",
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: "./types",
        lib: ["ESNext", "DOM", "DOM.Iterable"],
    }).reduce(
        (command, [index, value]) => command + ` --${index} ${value}`,
        ""
    );

    const expectTsd = entryPoints.map((entry) => path.parse(entry).name);

    const { stdout } = await pexec(
        `npx tsc ${entryPoints.join(" ")} ${serialieCommand}`
    );

    const { typesVersions = {} } = pkg;

    const prevAll = typesVersions["*"] || {};

    typesVersions["*"] = stdout
        .split(/\n/)
        .filter((file) => file.startsWith("TSFILE:"))
        .map((line) => {
            const file = path
                .relative(process.cwd(), line.replace(/^TSFILE:\s+/, "").trim())
                .replace(/\\/g, "/");
            return [file, path.parse(file).name.replace(/\.d$/, "")];
        })
        .filter(([, name]) => expectTsd.includes(name))
        .reduce((exp, [file, name]) => {
            // associate the type as the root of the project
            if (name == main) pkg.types = file;
            // create the type export
            exp[name] = [file];
            return exp;
        }, prevAll);

    pkg.typesVersions = typesVersions;
}
