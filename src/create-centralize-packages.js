import { read, cleanPath } from "./utils.js";
import { peerDependencies } from "./create-wrapper.js";
/**
 *
 * @param {Object} options
 * @param {string} [options.dist]
 * @param {string} [options.scope]
 * @param {string[]} options.input
 * @param {boolean} options.wrappers
 */
export async function createCentralizePackages(options) {
    const dist = options.dist || "wrappers";
    const pkgs = (
        await Promise.all(
            options.input.map(async (file) => {
                const pkg = JSON.parse(await read(file));
                return pkg.name;
            })
        )
    ).filter((name) => name !== options.scope);

    const code = (suffix = "") =>
        pkgs.map((pkg) => `export * from "${pkg}${suffix}";`).join("\n");

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

    return wrappers;
}
