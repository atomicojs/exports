import glob from "fast-glob";
import { createExports } from "./create-exports.js";
import { createPublish } from "./create-publish.js";
import { getJsonFormat, logger, read, write } from "./utils.js";

/**
 * @param {object} options
 * @param {string[]} options.src
 * @param {string} options.main
 * @param {string} options.dist
 * @param {boolean} options.wrappers
 * @param {boolean} options.workspaces
 * @param {boolean} [options.publish]
 * @param {boolean} [options.watch]
 * @param {boolean} [options.ignoreTypes]
 * @param {boolean} [options.centralizePackages]
 * @param {boolean} [options.centralizeWrappers]
 * @param {{src: string, snap: import("./create-exports").Pkg}} options.pkg
 */
export async function mergeExports(options) {
    logger(`getting files...`);

    const input = (
        await glob(
            options.src.map(
                (src) =>
                    src + (options.centralizePackages ? "/package.json" : "")
            ),
            {
                ignore: [
                    "node_modules",
                    "**/node_modules/**",
                    "**/_*/*",
                    "**/*.{test,spec,stories}.{js,jsx,ts,tsx,mjs}",
                    "**/_*.{js,jsx,ts,tsx,mjs}",
                ],
            }
        )
    ).filter((file) => !/\/node_modules\//.test(file));

    if (!input.length && !options.watch) {
        logger(`no files found`);
        process.exit(1);
    }

    logger(`${input.length} files found`);

    /**
     * @type {import("./create-exports").Pkg}
     */
    const pkg = options.pkg?.snap
        ? JSON.parse(options.pkg.snap)
        : { name: "my-package" };

    /**
     * Mutates the current pkg object, adding to it the
     * existing submodules within workspaces
     */
    if (options.workspaces && pkg.workspaces) {
        const workspaces = pkg.workspaces
            .map((path) => path.replace(/\/\*$/, "/"))
            .map(
                (path) =>
                    path + (path.endsWith("/") ? "" : "/") + "*/package.json"
            );

        /**
         * @type {import("./create-exports.js").Pkg[]}
         */
        const packages = await Promise.all(
            (
                await glob(workspaces, {
                    ignore: ["node_modules"],
                })
            ).map(async (file) => JSON.parse(await read(file)))
        );

        ["dependencies", "peerDependencies", "peerDependenciesMeta"].forEach(
            (type) =>
                packages.forEach((subPkg) => {
                    pkg[type] = {
                        ...subPkg[type],
                        ...pkg[type],
                    };
                })
        );
    }

    logger(`creating exports${options.wrappers ? ` and wrappers...` : ""}`);

    const result = await createExports({
        main: options.main,
        pkg,
        input: input,
        dist: options.dist,
        wrappers: options.wrappers,
        ignoreTypes: options.ignoreTypes,
        centralizePackages: options.centralizePackages,
        centralizeWrappers: options.centralizeWrappers,
    });

    if (result.wrappers.length) {
        await Promise.all(
            result.wrappers.map(({ fileDistJs, fileDistTs, codeJs, codeTs }) =>
                Promise.all([
                    codeJs && write(fileDistJs, codeJs),
                    codeTs && write(fileDistTs, codeTs),
                ])
            )
        );

        logger(`${result.wrappers.length} wrappers created`);
    }

    if (options.pkg?.src) {
        logger(`${pkg.name} updating...`);
        const format = getJsonFormat(options.pkg?.snap);
        await write(
            options.pkg.src,
            `${JSON.stringify(
                {
                    ...pkg,
                    ...result.pkg,
                },
                null,
                format.indent
            )}${format.endLine}`
        );
        logger(`${pkg.name} updated`);
    }

    if (options.publish && pkg.version) {
        logger(`${pkg.name} filtering release...`);
        const { status } = await createPublish(pkg.version);
        logger(
            `${pkg.name} ${
                status === "ignore"
                    ? "no release"
                    : status === "publish"
                    ? "published"
                    : "error"
            }`
        );
    }
}
