import { createExports } from "./create-exports.js";
import { parse } from "path";
import glob from "fast-glob";
import { write, getJsonIndent, logger, read } from "./utils.js";
import { createPublish } from "./create-publish.js";

/**
 * @param {object} options
 * @param {string} options.src
 * @param {string} options.main
 * @param {string} options.dist
 * @param {boolean} options.wrappers
 * @param {boolean} options.workspaces
 * @param {boolean} [options.publish]
 * @param {{src: string, snap: import("./create-exports").Pkg}} options.pkg
 */
export async function mergeExports(options) {
    logger(`Getting files...`);

    const input = await glob(options.src, {
        ignore: [
            "node_modules",
            "**/_*/*",
            "**/*.{test,spec}.{js,jsx,ts,tsx,mjs}",
            "**/_*.{js,jsx,ts,tsx,mjs}",
        ],
    });

    if (!input.length) {
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

    logger(`Creading exports${options.wrappers ? ` and wrappers` : ""}`);

    const result = await createExports({
        main: options.main,
        pkg,
        input: input,
        dist: options.dist,
        wrappers: options.wrappers,
    });

    if (options.wrappers && result.wrappers) {
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
        const pkgName = parse(options.pkg.src).base;
        logger(`${pkgName} updating`);
        await write(
            options.pkg.src,
            JSON.stringify(
                {
                    ...pkg,
                    ...result.pkg,
                },
                null,
                getJsonIndent(options.pkg?.snap)
            )
        );
        logger(`${pkgName} updated`);
    }

    if (options.publish && pkg.version) {
        logger(`${pkgName} filtering release...`);
        const { status } = await createPublish(pkg.version);
        logger(
            `${pkgName} ${
                status === "ignore"
                    ? "no release"
                    : status === "publish"
                    ? "published"
                    : "error"
            }`
        );
    }
}
