/**
 * @param {object} options
 * @param {string[]} options.src
 * @param {string} options.main
 * @param {string} options.dist
 * @param {boolean} options.wrappers
 * @param {boolean} options.workspaces
 * @param {boolean} [options.publish]
 * @param {boolean} [options.watch]
 * @param {boolean} [options.ignoreTypes]
 * @param {boolean} [options.centralizePackages]
 * @param {{src: string, snap: import("./create-exports").Pkg}} options.pkg
 */
export function mergeExports(options: {
    src: string[];
    main: string;
    dist: string;
    wrappers: boolean;
    workspaces: boolean;
    publish?: boolean;
    watch?: boolean;
    ignoreTypes?: boolean;
    centralizePackages?: boolean;
    pkg: {
        src: string;
        snap: import("./create-exports").Pkg;
    };
}): Promise<void>;
