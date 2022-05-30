import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import path from "path";
import esbuild from "esbuild";
import { readFile } from "fs/promises";
import { isJs, write } from "./utils.js";
import { TS_CONFIG_FIXED } from "./constants.js";

/**
 * @param {Object} options
 * @param {string} options.pkgName
 * @param {string} options.dist
 * @param {string} options.main
 * @param {string} options.customElements
 * @param {string[]} options.entryPoints
 * @param {boolean} options.types
 * @param {boolean} options.types
 * @param {boolean} options.exports
 */
export async function analyzer({ pkgName, dist, entryPoints, ...options }) {
    const wrappers = ["react", "preact"];

    const [exportsJs, exportsTs] = (
        await Promise.all(
            entryPoints.filter(isJs).map(async (file) => {
                const { ext, name } = path.parse(file);

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
                        if (
                            object &&
                            object.name ==
                                (options.customElements || "customElements")
                        ) {
                            const [literal, identifier, options] =
                                node.arguments;

                            if (!identifier?.name) return;

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

                    const exportsJs = [];
                    const exportsTs = [];

                    await Promise.all(
                        wrappers.map(async (wrapper) => {
                            const codeJs = [
                                `import "@atomico/react/proxy";`,
                                `import { auto } from "@atomico/react/${wrapper}";`,
                                `import { ${items.map(
                                    ([component]) =>
                                        `${component} as _${component}`
                                )} } from "${pkgName}/${name}";`,
                                ...items.map(
                                    ([component]) =>
                                        `export const ${component} = auto(_${component});`
                                ),
                            ];

                            const codeTs = items.map(([component]) =>
                                [
                                    `export const ${component}: import("@atomico/react/types/core/create-wrapper").Component<`,
                                    `typeof import("${pkgName}/${name}").${component}`,
                                    `>`,
                                ].join("")
                            );

                            const exportJs =
                                options.exports &&
                                `${dist}/${name}.${wrapper}.js`;

                            const exportTs =
                                options.types &&
                                `${TS_CONFIG_FIXED.outDir}/${name}.${wrapper}.d.ts`;

                            if (exportJs)
                                await write(exportJs, codeJs.join("\n"));

                            if (exportTs)
                                await write(exportTs, codeTs.join(";"));

                            exportsJs.push(exportJs);
                            exportsTs.push(exportTs);
                        })
                    );

                    return [exportsJs, exportsTs];
                }
            })
        )
    )
        .filter((outFile) => outFile)
        .reduce(
            ([exportsJs, exportsTs], [exportJs, exportTs]) => [
                exportJs ? [...exportsJs, ...exportJs] : exportsJs,
                exportTs ? [...exportsTs, ...exportTs] : exportsTs,
            ],
            [[], []]
        );

    if (entryPoints.length > 1 && exportsJs.length) {
        await Promise.all(
            wrappers.map(async (wrapper) => {
                const item = exportsJs
                    .filter((file) => file.endsWith(`.${wrapper}.js`))
                    .map(
                        (item) =>
                            `\nexport * from "${pkgName}${item
                                .replace(dist, "")
                                .replace(/\.js$/, "")}";`
                    );
                const distAll = `${dist}/${wrapper}.js`;
                const distTypes = `${TS_CONFIG_FIXED.outDir}/${wrapper}.d.ts`;
                await write(distAll, item.join("\n"));
                exportsJs.push(distAll);
                if (options.types) {
                    await write(distTypes, item.join("\n"));
                    exportsTs.push(distTypes);
                }
            })
        );
    }

    return [exportsJs, exportsTs];
}
