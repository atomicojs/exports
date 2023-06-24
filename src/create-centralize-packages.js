import { read, cleanPath } from "./utils.js";
/**
 *
 * @param {Object} options
 * @param {string} [options.dist]
 * @param {string} [options.scope]
 * @param {string[]} options.input
 */
export async function createCentralizePackages(options) {
    const pkgs = (
        await Promise.all(
            options.input.map(async (file) => {
                const pkg = JSON.parse(await read(file));
                return pkg.name;
            })
        )
    ).filter((name) => name === options.scope);

    const code = (suffix = "") =>
        pkgs.map((pkg) => `export * from "${pkg}${suffix}";`).join("\n");

    return [
        {
            fileExport: "",
            fileExportDistJs: cleanPath(`${options.dist}/index.js`),
            fileExportDistTs: cleanPath(`${options.dist}/index.d.ts`),
            codeJs: code(),
            codeTs: code(),
        },
    ];
}
