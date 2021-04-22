import glob from "fast-glob";
import esbuild from "esbuild";
import jsxRuntime from "@atomico/esbuild-jsx-runtime";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, writeFile } from "fs/promises";

const pexec = promisify(exec);

const logger = (message, br) => {
    const date = new Date();
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((value) => (value > 9 ? value : "0" + value))
        .join(":");
    console.log(`${br ? "\n" : ""}[${time}] PKG.NAME ${message}`);
};

/**
 * @param {object} config
 * @param {string} config.src
 * @param {string} config.dest
 * @param {boolean} config.types
 * @param {boolean} config.exports
 * @param {boolean} config.minify
 * @param {boolean} config.sourcemap
 * @param {(config:import("esbuild").BuildOptions)=>import("esbuild").BuildOptions} [config.preload]
 * @returns
 */
export async function prepare(config) {
    logger("Initializing...", true);
    //@ts-ignore
    const entryPoints = await glob(config.src);

    if (!entryPoints.length) {
        return logger("No file input!");
    } else {
        logger("Generating outputs with esbuild...");
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
        plugins: [jsxRuntime()],
    };

    const { metafile } = await esbuild.build(
        config.preload ? config.preload(build) : build
    );

    logger("Esbuild completed...");

    await Promise.all([
        config.types &&
            new Promise(async (resolve, reject) => {
                try {
                    logger("Preparing types...");
                    await generateTypes(entryPoints);
                    resolve();
                    logger("Finished types!");
                } catch (e) {
                    console.error(e);
                    reject();
                }
            }),
        config.exports &&
            new Promise((resolve, reject) => {
                try {
                    logger("Adding outputs to package.json#exports...");
                    generateExports(metafile);
                    resolve();
                    logger("Added outputs!");
                } catch (e) {
                    console.error(e);
                    reject();
                }
            }),
    ]);

    logger("completed!");
}
/**
 *
 * @param {import("esbuild").Metafile} metafile
 */
async function generateExports(metafile) {
    const pkg = JSON.parse(
        await readFile(process.cwd() + "/package.json", "utf-8")
    );

    pkg.exports = Object.entries(metafile.outputs)
        .filter(([, { entryPoint = "" }]) => /\.[jt]s[x]*$/.test(entryPoint))
        .reduce(
            (exports, [output]) => ({
                ...exports,
                ["./" + path.parse(output).name]: "./" + output,
            }),
            {
                ...pkg.exports,
            }
        );

    await writeFile(
        process.cwd() + "/package.json",
        JSON.stringify(pkg, null, pkg?.prettier?.tabWidth || 2)
    );
}
/**
 *
 * @param {string[]} entryPoints
 */
async function generateTypes(entryPoints) {
    const serialieCommand = Object.entries({
        strict: true,
        jsx: "react-jsx",
        jsxImportSource: "atomico",
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
        outDir: "./",
        lib: ["ESNext", "DOM", "DOM.Iterable"],
    }).reduce(
        (command, [index, value]) => command + ` --${index} ${value}`,
        ""
    );

    await pexec(`npx tsc ${entryPoints.join(" ")} ${serialieCommand}`);
}
