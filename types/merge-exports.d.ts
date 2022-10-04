/**
 * @param {object} options
 * @param {string} options.src
 * @param {string} options.main
 * @param {string} options.dist
 * @param {boolean} options.wrappers
 * @param {boolean} options.workspaces
 * @param {{src: string, snap: import("./create-exports").Pkg}} options.pkg
 */
export function mergeExports(options: {
    src: string;
    main: string;
    dist: string;
    wrappers: boolean;
    workspaces: boolean;
    pkg: {
        src: string;
        snap: import("./create-exports").Pkg;
    };
}): Promise<void>;
