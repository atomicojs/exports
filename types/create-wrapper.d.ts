/**
 * @param {object} options
 * @param {string} options.scope
 * @param {[string,string][]} options.input
 * @param {string} [options.dist]
 * @param {string} [options.main]
 * @param {boolean} [options.centralizeWrappers]
 * @returns {ReturnType<typeof createWrapper>}
 */
export function createWrappers(options: {
    scope: string;
    input: [string, string][];
    dist?: string;
    main?: string;
    centralizeWrappers?: boolean;
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
export const distWrapper: "wrapper";
/**
 * @type {{name: string, path: string, version: string, jsx: boolean, template: (({declaration: boolean, importScope: string } , elements:[string, { export: boolean, tagName: string,  is: string; alias: string }][])=>void) }[]}
 */
export const peerDependencies: {
    name: string;
    path: string;
    version: string;
    jsx: boolean;
    template: ({ declaration: boolean, importScope: string }: {
        declaration: any;
        importScope: any;
    }, elements: [string, {
        export: boolean;
        tagName: string;
        is: string;
        alias: string;
    }][]) => void;
}[];
