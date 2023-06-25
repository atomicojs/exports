import { read, cleanPath } from "./utils.js";
import { peerDependencies, distWrapper } from "./create-wrapper.js";
/**
 *
 * @param {Object} options
 * @param {string} [options.dist]
 * @param {string} [options.scope]
 * @param {string[]} options.input
 * @param {boolean} options.wrappers
 */
export async function createCentralizePackages(options) {
    const dist = options.dist || distWrapper;
    /**
     * @type {{name:string, version:string}[]}
     */
    const dependencies = (
        await Promise.all(
            options.input.map(async (file) => {
                const pkg = JSON.parse(await read(file));
                if (pkg.private) return;
                return {
                    name: pkg.name,
                    version: pkg.version,
                };
            })
        )
    )
        .filter((dependency) => dependency)
        .filter(({ name }) => name !== options.scope);

    const code = (suffix = "") =>
        dependencies
            .map(({ name }) => `export * from "${name}${suffix}";`)
            .join("\n");

    const wrappers = [
        {
            fileExport: "",
            fileDistJs: cleanPath(`${dist}/index.js`),
            fileDistTs: cleanPath(`${dist}/index.d.ts`),
            codeJs: code(),
            codeTs: code(),
        },
    ];

    if (options.wrappers) {
        wrappers.push(
            ...peerDependencies.map(({ path }) => ({
                fileExport: "/" + path,
                fileDistJs: cleanPath(`${dist}/${path}.js`),
                fileDistTs: cleanPath(`${dist}/${path}.d.ts`),
                codeJs: code("/" + path),
                codeTs: code("/" + path),
            }))
        );
    }

    return { wrappers, dependencies };
}
