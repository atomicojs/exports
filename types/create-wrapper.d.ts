/**
 * @param {object} options
 * @param {string} options.scope
 * @param {[string,string][]} options.input
 * @param {string} [options.dist]
 * @param {string} [options.main]
 * @returns {ReturnType<typeof createWrapper>}
 */
export function createWrappers(options: {
    scope: string;
    input: [string, string][];
    dist?: string;
    main?: string;
}): ReturnType<typeof createWrapper>;
/***
 * @param {object} options
 * @param {object} options.input
 * @param {string} options.scope
 * @param {string} options.path
 * @param {string} options.dist
 * @param {string} options.main
 */
export function createWrapper(options: {
    input: object;
    scope: string;
    path: string;
    dist: string;
    main: string;
}): Promise<{
    fileExport: string;
    fileDistJs: string;
    fileDistTs: string;
    codeJs: string;
    codeTs: string;
}[]>;
export const peerDependencies: ({
    name: string;
    path: string;
    version: string;
    jsx: boolean;
    submodule?: undefined;
} | {
    name: string;
    submodule: string;
    path: string;
    version: string;
    jsx: boolean;
} | {
    name: string;
    path: string;
    version: string;
    jsx?: undefined;
    submodule?: undefined;
})[];
