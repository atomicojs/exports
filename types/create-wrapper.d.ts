/**
 * @param {object} options
 * @param {string} options.scope
 * @param {[string,string][]} options.input
 * @param {string} [options.dist]
 * @returns {ReturnType<typeof createWrapper>}
 */
export function createWrappers(options: {
    scope: string;
    input: [string, string][];
    dist?: string;
}): ReturnType<typeof createWrapper>;
/***
 * @param {object} options
 * @param {object} options.input
 * @param {string} options.scope
 * @param {string} options.path
 * @param {string} options.dist
 */
export function createWrapper(options: {
    input: object;
    scope: string;
    path: string;
    dist: string;
}): Promise<{
    fileExport: string;
    fileDistJs: string;
    fileDistTs: string;
    codeJs: string;
    codeTs: string;
}[]>;
export const peerDependencies: {
    name: string;
    path: string;
    version: string;
}[];
