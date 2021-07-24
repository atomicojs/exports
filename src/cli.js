import cac from "cac";
import { prepare } from "./module.js";
export { prepare } from "./module.js";

const toArray = (value) => value.split(/ *, */);

const cli = cac("devserver").version("0.6.0");

cli.command("<...files>", "Build files")
    .option("--dist <dist>", "Choose a project type")
    .option("--types", "Generate the .d.ts files in root using typescript")
    .option("--exports", "Add the output files to package.json#exports")
    .option("--minify", "minify the code output")
    .option("--ignore-build", "ignore the use of esbuild")
    .option("--watch", "Enable the use of watch in esbuild")
    .option("--meta-url <files>", "resolve files as meta-url")
    .option("--format <format>", "output type, default esm")
    .option("--bundle", "bundle")
    .option(
        "--main <export>",
        "define si una exportacion debe ser asociada como root del package"
    )
    .option(
        "--target <target>",
        "Defines the target to associate for the output"
    )
    .option(
        "--workspace <packages>",
        "associate the workspace dependencies to the root package.json"
    )
    .option("--sourcemap", "generate the sourcemap")
    .example("exports components/*.jsx")
    .example("exports components/*.jsx --types")
    .example("exports components/*.jsx --exports")
    .example("exports components/*.jsx --types --exports")
    .action(
        (
            src,
            {
                dist = "dist",
                main,
                types,
                exports,
                minify,
                sourcemap,
                watch,
                target,
                format,
                metaUrl,
                workspace,
                ignoreBuild,
                reactWrapper,
                bundle,
            }
        ) => {
            prepare({
                src,
                dist,
                main,
                types,
                watch,
                format,
                minify,
                exports,
                sourcemap,
                workspace,
                metaUrl: metaUrl ? toArray(target) : [],
                target: target ? toArray(target) : null,
                ignoreBuild,
                reactWrapper,
                bundle,
            });
        }
    );

cli.help();

cli.parse();
