import * as acorn from "acorn";
import * as acornWalk from "acorn-walk";
import { readFile } from "fs/promises";

/**
 * @param {object} options
 * @param {string} options.scope
 * @param {[string,string][]} options.input
 * @param {string} [options.dist]
 * @returns
 */
export async function createWrappers(options) {
    return (
        await Promise.all(
            options.input.map(([path, input]) =>
                createWrapper({
                    input,
                    path,
                    scope: options.scope,
                    dist: options.dist || "exports",
                })
            )
        )
    ).flat(2);
}

/***
 * @param {object} options
 * @param {object} options.input
 * @param {string} options.scope
 * @param {string} options.path
 * @param {string} options.dist
 */
export async function createWrapper(options) {
    const code = await readFile(options.input, "utf8");

    const ast = acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
    });

    const customElements = {};

    acornWalk.ancestor(ast, {
        ExportNamedDeclaration(node) {
            const { type } = node.declaration;
            /**
             * @type {string}
             */
            let id;

            if (type === "ClassDeclaration") {
                id = node?.declaration?.id?.name;
            } else if (type === "VariableDeclaration") {
                id = node?.declaration?.declarations?.[0]?.id?.name;
            }

            customElements[id] = {
                ...customElements[id],
                export: true,
            };
        },
        CallExpression(node) {
            const { object } = node.callee;
            if (object && object.name == "customElements") {
                const [literal, identifier, options] = node.arguments;

                if (!identifier?.name) return;

                const id = identifier.name;

                customElements[id] = {
                    ...customElements[id],
                    tagName: literal.value,
                    is:
                        options &&
                        options.properties[0] &&
                        options.properties[0].key.name == "extends" &&
                        options.properties[0].value.value,
                };
            }
        },
    });

    const origin = options.path;

    const elements = Object.entries(customElements).filter(
        ([, ref]) => ref.export && ref.tagName
    );

    if (!elements.length) return;

    const imports = elements.map(([name]) => `${name} as _${name}`);

    const originModule = `import { ${imports.join(", ")} } from "${
        options.scope
    }/${origin}";`;

    /**
     * Task wrappers
     */
    return await Promise.all(
        [
            { name: "@atomico/react", path: "react" },
            { name: "@atomico/react/preact", path: "preact" },
            { name: "@atomico/vue", path: "vue" },
        ].map(async ({ name, path }) => {
            const codeJs = [
                originModule,
                `import { auto } from "${name}";`,
                elements.map(
                    ([name]) => `export const ${name} = auto(_${name});`
                ),
            ]
                .flat(10)
                .join("\n");

            const fileExport = `${origin}/${path}`;

            const fileDistJs = `${options.dist}/${fileExport}.js`;

            const codeTs = [
                originModule,
                `import { Auto, Component } from "${name}";`,
                elements.map(
                    ([name]) => `export const ${name}: Auto(_${name});`
                ),
            ]
                .flat(10)
                .join("\n");

            const fileDistTs = `${options.dist}/${fileExport}.d.ts`;

            return {
                fileExport,
                fileDistJs,
                fileDistTs,
                codeJs,
                codeTs,
            };
        })
    );
}
