import { read } from "./utils.js";
/**
 *
 * @param {Object} options
 * @param {string} [options.dist]
 * @param {string[]} options.input
 */
export async function createCentralizePackages({ input }) {
    const pkgs = await Promise.all(
        input.map(async (file) => {
            const pkg = JSON.parse(await read(file));
            return pkg.name;
        })
    );

    const code = (suffix = "") =>
        pkgs.map((pkg) => `export * from "${pkg}${suffix}";`).join("\n");

    return [
        {
            fileExport: "",
            fileExportDistJs: "",
            fileExportDistTs: "",
            codeJs: code(),
            codeTs: code(),
        },
    ];
}
