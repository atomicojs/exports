/**
 * @param {object} options
 * @param {string[]} options.input
 * @param {Pkg} options.pkg
 * @param {string} [options.main]
 * @param {string} [options.dist]
 * @param {boolean} [options.wrappers]
 */
export function createExports(options: {
    input: string[];
    pkg: Pkg;
    main?: string;
    dist?: string;
    wrappers?: boolean;
}): Promise<{
    pkg: {
        exports: any;
        typesVersions: {
            "*": any;
        };
        peerDependencies: {
            [src: string]: string;
        };
        peerDependenciesMeta: {
            [src: string]: {
                optional: boolean;
            };
        };
        main: any;
        module: any;
        types: any;
    };
    wrappers: {
        fileExport: string;
        fileDistJs: string;
        fileDistTs: string;
        codeJs: string;
        codeTs: string;
    }[];
}>;
export type Pkg = {
    name: string;
    workspaces: string[];
    exports?: {
        [src: string]: string;
    };
    dependencies?: {
        [src: string]: string;
    };
    peerDependencies?: {
        [src: string]: string;
    };
    peerDependenciesMeta?: {
        [src: string]: {
            optional: boolean;
        };
    };
    typesVersions?: {
        [src: string]: {
            [src: string]: string[];
        };
    };
};
