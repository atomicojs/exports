import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import path from "path";
import { readFile, writeFile } from "fs/promises";
/**
 * @param {string[]} outputs
 */
export async function analize(outputs) {
    return [
        ...new Set([
            ...outputs,
            ...(
                await Promise.all(
                    outputs.map(async (file) => {
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
                                    const [literal, identifier] =
                                        node.arguments;
                                    customElements.set(identifier.name, {
                                        tagName: literal.value,
                                    });
                                }
                            },
                        });

                        if (customElements.size) {
                            const items = [...customElements];
                            const { base } = path.parse(file);
                            const lines = [
                                `import { wrapper } from "@atomico/react";`,
                                `import {${items.map(
                                    ([name]) => `${name} as _${name}`
                                )}} from "./${base}";`,
                                ...items.map(
                                    ([name, { tagName }]) =>
                                        `export const ${name} = wrapper("${tagName}", _${name});`
                                ),
                            ];

                            const outFile = file.replace(
                                /\.(\w+)$/,
                                ".react.$1"
                            );

                            writeFile(outFile, lines.join("\n"));

                            return outFile;
                        }
                    })
                )
            ).filter((outFile) => outFile),
        ]),
    ];
}
