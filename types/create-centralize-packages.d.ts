/**
 *
 * @param {Object} options
 * @param {string} [options.dist]
 * @param {string} [options.scope]
 * @param {string[]} options.input
 * @param {boolean} options.wrappers
 */
export function createCentralizePackages(options: {
    dist?: string;
    scope?: string;
    input: string[];
    wrappers: boolean;
}): Promise<{
    wrappers: {
        fileExport: string;
        fileDistJs: string;
        fileDistTs: string;
        codeJs: string;
        codeTs: string;
    }[];
    dependencies: {
        name: string;
        version: string;
    }[];
}>;
