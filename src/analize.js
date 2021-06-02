import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import path from "path";
import { readFile, writeFile } from "fs/promises";
/**
 * @param {string[]} outputs
 */
export async function analize(outputs) {
    return (
        await Promise.all(
            outputs
                .filter((output) => /\.(js|mjs)$/.test(output))
                .map(async (file) => {
                    const content = await readFile(file, "utf-8");
                    const ast = acorn.parse(content, {
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
                        const { base } = path.parse(file);

                        const codeJs = [
                            `import { wrapper } from "@atomico/react";`,
                            `import { ${items.map(
                                ([name]) => `${name} as _${name}`
                            )} } from "./${base}";`,
                            ...items.map(
                                ([name, { tagName, is }]) =>
                                    `export const ${name} = wrapper("${tagName}", _${name}${
                                        is ? `, { extends: "${is}" }` : ""
                                    });`
                            ),
                        ];

                        const outFileReact = file.replace(
                            /\.(\w+)$/,
                            ".react.$1"
                        );
                        const outFileCss = file.replace(
                            /\.(\w+)$/,
                            ".visibility.css"
                        );

                        const codeCss = `${items.map(
                            ([, { tagName }]) => `${tagName}:not(:defined)`
                        )}{ visibility: hidden }`;

                        writeFile(outFileReact, codeJs.join("\n"));
                        writeFile(outFileCss, codeCss);

                        return [outFileReact, outFileCss];
                    }
                })
        )
    )
        .filter((outFile) => outFile)
        .reduce(
            ([outFilesReact, outFilesCss], [outFileReact, outFileCss]) => [
                [...outFilesReact, outFileReact],
                [...outFilesCss, outFileCss],
            ],
            [[], []]
        );
}
