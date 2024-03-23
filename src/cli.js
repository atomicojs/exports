#!/usr/bin/env node
import cac from "cac";
import chokidar from "chokidar";
import { mergeExports } from "./merge-exports.js";
import { read, logger } from "./utils.js";
import { subscribe } from "@uppercod/clean-terminal";

const cwd = process.cwd();

const cli = cac("@atomico/exports").version("1.11.0");

cli.command("<...files>", "Build files")
    .option("--dist <dist>", "Destination directory")
    .option("--main <dist>", "Main file")
    .option("--watch", "watch mode")
    .option("--wrappers", "enable the wrapper generator")
    .option(
        "--preserve-extensions",
        "preserve file extensions in exports, for broader ESM compatibility"
    )
    .option("--ignore-types", "enable the wrapper generator")
    .option("--workspaces", "enable dependency merging")
    .option(
        "--centralize-packages",
        "centralizes all packages found in the given directory into a single package"
    )
    .option(
        "--centralize-wrappers",
        "centralizes all wrappers found in the given directory into a single file"
    )
    .option(
        "--publish",
        "publish the package if the version is different from the previous one from npm"
    )
    .option("--tmp", "allows to generate a temporary package.json")
    .action(
        /**
         *
         * @param {string[]} src
         * @param {object} flags
         * @param {boolean} flags.watch
         * @param {string} flags.dist
         * @param {string} flags.main
         * @param {boolean} flags.wrappers
         * @param {boolean} flags.preserveExtensions
         * @param {boolean} flags.tmp
         * @param {boolean} flags.workspaces
         * @param {boolean} flags.publish
         * @param {boolean} flags.ignoreTypes
         * @param {boolean} flags.centralizePackages
         * @param {boolean} flags.centralizeWrappers
         */
        async (
            src,
            {
                watch,
                main = "index",
                preserveExtensions,
                wrappers,
                dist,
                tmp,
                workspaces,
                publish,
                ignoreTypes,
                centralizePackages,
                centralizeWrappers,
            }
        ) => {
            const srcPkg = cwd + "/package.json";
            const snapPkg = await read(srcPkg);
            const send = () =>
                mergeExports({
                    src,
                    main,
                    wrappers,
                    preserveExtensions,
                    dist,
                    pkg: {
                        src: tmp
                            ? srcPkg.replace(/\.json$/, ".tmp.json")
                            : srcPkg,
                        snap: snapPkg,
                    },
                    workspaces,
                    publish: watch ? false : publish,
                    watch,
                    ignoreTypes,
                    centralizePackages,
                    centralizeWrappers,
                });

            await send();

            if (watch) {
                logger("waiting for changes...\n");

                /**  @type {boolean} */
                let prevent;

                const handler = () => {
                    if (!prevent) {
                        prevent = true;

                        const id = setTimeout(async () => {
                            prevent = false;
                            logger("updating...");
                            await send();
                            logger("waiting for changes...\n");
                        }, 200);

                        subscribe(() => clearTimeout(id));
                    }
                };

                const watch = chokidar.watch(src);

                watch.on("change", handler);
                watch.on("add", handler);
                watch.on("unlink", handler);

                subscribe(() => watch.close());
            }
        }
    );

cli.help();

cli.parse();
