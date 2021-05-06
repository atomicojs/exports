import cac from "cac";
import { prepare } from "./module.js";
export { prepare } from "./module.js";

const toArray = (value) => value.split(/ *, */);

const cli = cac("devserver").version("PKG.VERSION");

cli.command("<...files>", "Build files")
    .option("--dest <dest>", "Choose a project type")
    .option("--types", "Generate the .d.ts files in root using typescript")
    .option("--exports", "Add the output files to package.json#exports")
    .option("--minify", "minify the code output")
    .option("--watch", "Enable the use of watch in esbuild")
    .option("--meta-url <files>", "resolve files as meta-url")
    .option("--format <format>", "output type, default esm")
    .option(
        "--target <target>",
        "Defines the target to associate for the output"
    )
    .option("--sourcemap", "generate the sourcemap")
    .example("PKG.CLI components/*.jsx")
    .example("PKG.CLI components/*.jsx --types")
    .example("PKG.CLI components/*.jsx --exports")
    .example("PKG.CLI components/*.jsx --types --exports")
    .action(
        (
            src,
            {
                dest = "dest",
                types,
                exports,
                minify,
                sourcemap,
                watch,
                target,
                format,
                metaUrl,
            }
        ) => {
            prepare({
                src,
                dest,
                types,
                watch,
                format,
                minify,
                exports,
                sourcemap,
                metaUrl: metaUrl ? toArray(target) : [],
                target: target ? toArray(target) : null,
            });
        }
    );

cli.help();

cli.parse();
