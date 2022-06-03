#!/usr/bin/env node
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
    .option("--custom-elements <alias>", "define an alias for custom-elements")
    .option("--format <format>", "output type, default esm")
    .option("--css-literals-postcss", "parse css literals with postcss")
    .option("--bundle", "bundle")
    .option("--publish", "bundle")
    .option(
        "--analyzer",
        "Automatically generates additional support for React and Css from the webcomponents"
    )
    .option(
        "--main <export>",
        "define si una exportacion debe ser asociada como root del package"
    )
    .option(
        "--target <target>",
        "Defines the target to associate for the output"
    )
    .option("--sourcemap", "generate the sourcemap")
    .option("--global-name <name>", "globalName for export in iife format")
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
                ignoreBuild,
                reactWrapper,
                bundle,
                analyzer,
                customElements,
                globalName,
                cssLiteralsPostcss,
                publish,
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
                metaUrl: metaUrl ? toArray(metaUrl) : [],
                target: target ? toArray(target) : null,
                ignoreBuild,
                reactWrapper,
                bundle,
                analyzer,
                customElements,
                globalName,
                cssLiteralsPostcss,
                publish,
            });
        }
    );

cli.help();

cli.parse();
