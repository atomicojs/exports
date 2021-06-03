import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import path from "path";
import esbuild from "esbuild";
import { readFile } from "fs/promises";
import { isJs, write } from "./utils.js";
import { TS_CONFIG } from "./constants.js";

/**
 * @param {Object} options
 * @param {string} options.pkgName
 * @param {string} options.dest
 * @param {string[]} options.entryPoints
 * @param {boolean} options.types
 * @param {boolean} options.exports
 */
export async function analyzer({ pkgName, dest, entryPoints, ...options }) {
    return (
        await Promise.all(
            entryPoints.filter(isJs).map(async (file) => {
                const { base, ext, name } = path.parse(file);

                const { code } = await esbuild.transform(
                    await readFile(file, "utf-8"),
                    { format: "esm", loader: ext.slice(1) }
                );

                const ast = acorn.parse(code, {
                    ecmaVersion: "latest",
                    sourceType: "module",
                });

                const customElements = new Map();

                acornWalk.ancestor(ast, {
                    ExportNamedDeclaration(node) {
                        const { specifiers } = node;
                        const [{ exported }] = specifiers;
                        const ref = customElements.get(exported.name);
                        if (ref) ref.export = true;
                    },
                    CallExpression(node) {
                        const { object } = node.callee;
                        if (object && object.name == "customElements") {
                            const [literal, identifier, options] =
                                node.arguments;

                            customElements.set(identifier.name, {
                                tagName: literal.value,
                                is:
                                    options &&
                                    options.properties[0] &&
                                    options.properties[0].key.name ==
                                        "extends" &&
                                    options.properties[0].value.value,
                            });
                        }
                    },
                });

                if (customElements.size) {
                    const items = [...customElements];

                    const codeJs = [
                        `import { wrapper } from "@atomico/react";`,
                        `import { ${items.map(
                            ([component]) => `${component} as _${component}`
                        )} } from "${pkgName}/${name}";`,
                        ...items.map(
                            ([component, { tagName, is }]) =>
                                `export const ${component} = wrapper("${tagName}", _${component}${
                                    is ? `, { extends: "${is}" }` : ""
                                });`
                        ),
                    ];

                    const codeTs = items
                        .map(([component]) => [
                            `export const ${component}: import("@atomico/react").Component<`,
                            `import("${pkgName}/${name}").${component},`,
                            `import("${pkgName}/${name}").${component}`,
                            `>`,
                        ])
                        .flat();

                    const codeCss = `${items.map(
                        ([, { tagName }]) => `${tagName}:not(:defined)`
                    )}{ visibility: hidden }`;

                    const exportJs =
                        options.exports && `${dest}/${name}.react.js`;
                    const exportCss =
                        options.exports && `${dest}/${name}.visibility.css`;
                    const exportTs =
                        options.types &&
                        `${TS_CONFIG.outDir}/${name}.react.d.ts`;

                    if (exportJs) await write(exportJs, codeJs.join(""));

                    if (exportCss) await write(exportCss, codeCss);

                    if (exportTs) await write(exportTs, codeTs.join(""));

                    return [exportJs, exportCss, exportTs];
                }
            })
        )
    )
        .filter((outFile) => outFile)
        .reduce(
            (
                [exportsJs, exportsCss, exportsTs],
                [exportJs, exportCss, exportTs]
            ) => [
                exportJs ? [...exportsJs, exportJs] : exportsJs,
                exportCss ? [...exportsCss, exportCss] : exportsCss,
                exportTs ? [...exportsTs, exportTs] : exportsTs,
            ],
            [[], [], []]
        );
}
