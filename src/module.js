import glob from "fast-glob";
import esbuild from "esbuild";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import pluginMetaUrl from "@uppercod/esbuild-meta-url";
import { pluginPipeline } from "./plugin-pipeline.js";
import { pluginExternals } from "./plugin-externals.js";
import { addDotRelative } from "./utils.js";
import { loadCss } from "./load-css.js";
import { analyzer } from "./analyzer.js";
import { createPackageService } from "./package-service.js";

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

const aliasDep = {
    dep: "dependencies",
    peerDep: "peerDependencies",
    peerDepMeta: "peerDependenciesMeta",
};

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
 * @param {string} config.dist
 * @param {boolean} [config.types]
 * @param {boolean} [config.minify]
 * @param {boolean} [config.watch]
 * @param {boolean} [config.exports]
 * @param {boolean} [config.sourcemap]
 * @param {boolean} [config.format]
 * @param {boolean} [config.ignoreBuild]
 * @param {boolean} [config.bundle]
 * @param {boolean} [config.analyzer]
 * @param {string} [config.main]
 * @param {string} [config.workspace]
 * @param {string} [config.customElements]
 * @param {string[]} [config.target]
 * @param {string[]} [config.metaUrl]
 * @param {string} [config.globalName]
 * @param {(config:import("esbuild").BuildOptions)=>import("esbuild").BuildOptions} [config.preload]
 * @param {boolean} [config.cssLiteralsPostcss]
 * @returns
 */
export async function prepare(config) {
    console.log("\nExports");

    config = {
        ...config,
    };

    config.format = config.format || "esm";

    logger("Initializing...");
    //@ts-ignore
    let entryPoints = await glob(config.src, {
        ignore: [
            "**/_*/*",
            "**/*.*.{js,jsx,ts,tsx,mjs}",
            "**/_*.{js,jsx,ts,tsx,mjs}",
        ],
    });

    const packageSrc = process.cwd() + "/package.json";
    // const tsconfigSrc = process.cwd() + "/tsconfig.json";

    if (entryPoints.length === 1 && !config.main) {
        const [first] = entryPoints;
        config.main = path.parse(first).name;
    }

    const packageService = await createPackageService(packageSrc, config.main);

    // const [pkg, pkgText] = await getJson(pkgRootSrc);
    // const [tsconfig] = await getJson(tsconfigSrc).catch(() => [{}, ""]);

    // const externalDependencies = getExternal(pkg);
    // const externalPeerDependencies = {};
    // const externalPeerDependenciesMeta = {};

    // if (config.workspace) {
    //     (
    //         await Promise.all(
    //             (
    //                 await glob(
    //                     config.workspace +
    //                         (config.workspace.endsWith("package.json")
    //                             ? ""
    //                             : (config.workspace.endsWith("/") ? "" : "/") +
    //                               "package.json")
    //                 )
    //             ).map((file) => getJson(file))
    //         )
    //     ).forEach(([pkg]) => {
    //         getExternal(pkg, externalDependencies);
    //         getExternal(pkg, externalPeerDependencies, aliasDep.peerDep);
    //         getExternal(
    //             pkg,
    //             externalPeerDependenciesMeta,
    //             aliasDep.peerDepMeta
    //         );
    //     });
    // }

    const metaUrl = (config.metaUrl || [])
        .concat(assets)
        .reduce((metaUrl, key) => {
            metaUrl[key] = true;
            return metaUrl;
        }, {});

    if (!metaUrl.css) {
        metaUrl.scss = metaUrl.css = loadCss;
    } else {
        metaUrl.scss = metaUrl.css;
    }

    if (!entryPoints.length) {
        logger("No file input!");
        process.exit(1);
    }

    // generate a copy to get the external dependencies
    const externalDependenciesKeys = Object.keys(
        await packageService.getExternals()
    );

    // if (config.analyzer && (config.exports || config.types)) {
    //     const [exportsJs, exportsTs] = await analyzer({
    //         pkgName: pkg.name,
    //         dist: config.dist,
    //         main: config.main,
    //         customElements: config.customElements,
    //         entryPoints,
    //         types: config.types,
    //         exports: config.exports,
    //     });

    //     setPkgExports(pkg, exportsJs, config.main);
    //     setPkgTypesVersions(pkg, exportsTs, config.main);
    //     setPkgDependencies(
    //         pkg,
    //         {
    //             "@atomico/react": "latest",
    //         },
    //         aliasDep.peerDep
    //     );
    //     setPkgDependencies(
    //         pkg,
    //         {
    //             "@atomico/react": {
    //                 optional: true,
    //             },
    //         },
    //         aliasDep.peerDepMeta
    //     );
    // }

    /**
     * @type {import("esbuild").BuildOptions}
     */
    const build = {
        entryPoints,
        outdir: config.dist,
        jsxFactory: "_jsx",
        jsxFragment: "host",
        sourcemap: config.sourcemap,
        metafile: true,
        minify: config.minify,
        bundle: true,
        format: config.format,
        splitting: config.format !== "esm" ? false : true,
        globalName: config.globalName,
        external: config.bundle ? [] : externalDependenciesKeys,
        watch: config.watch
            ? {
                  async onRebuild(error, { metafile: { outputs } }) {
                      await processExports(
                          Object.keys(outputs).map(addDotRelative)
                      );

                      const entries = Object.values(outputs)
                          .map(({ entryPoint }) => addDotRelative(entryPoint))
                          .flat(2);

                      await processTypes(entries);

                      await processAnalyzer(entries);

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
            pluginPipeline({ minify: config.minify }),
            pluginMetaUrl(metaUrl),
            pluginExternals(config.bundle ? [] : externalDependenciesKeys),
        ],
    };

    if (config.target) build.target = config.target;

    /**
     * @type {Promise<ReturnType<import("./typescript-service").createService>>}
     */
    let typescriptService;

    /**
     *
     * @param {string[]} outpus
     */
    const processExports = async (outpus) => {
        const outputsFromEntries = outpus.filter(
            (output) => !/chunk-(\S+)\.js$/.test(output)
        );
        if (config.exports) {
            await packageService.set("exports", outputsFromEntries);
        }
    };
    /**
     *
     * @param {string[]} entries
     */
    const processTypes = async (entries) => {
        if (config.types) {
            if (!typescriptService) {
                typescriptService = import("./typescript-service.js").then(
                    ({ createService }) => createService(entryPoints)
                );
            }

            const service = await typescriptService;

            const outfilesDTs = service.output(entries);

            if (outfilesDTs.length) {
                packageService.set("types", outfilesDTs);
            }
        }
    };

    /**
     * @param {string[]} entries
     */
    const processAnalyzer = async (entries) => {
        const pkg = await packageService.get();
        const [exportsJs, exportsTs] = await analyzer({
            ...config,
            pkgName: pkg.name,
            dist: config.dist,
            entryPoints: entries,
        });
        processExports(exportsJs.map(addDotRelative));
        processTypes(exportsTs.map(addDotRelative));
    };

    if (!config.ignoreBuild) {
        logger("Generating outputs with esbuild...");

        const { metafile } = await esbuild.build(
            config.preload ? config.preload(build) : build
        );

        await processExports(Object.keys(metafile.outputs));
        await processTypes(build.entryPoints);
        await processAnalyzer(build.entryPoints);

        logger("Esbuild completed...");
    }
}
