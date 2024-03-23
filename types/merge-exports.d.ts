/**
 * @param {object} options
 * @param {string[]} options.src
 * @param {string} options.main
 * @param {string} options.dist
 * @param {boolean} options.preserveExtensions
 * @param {boolean} options.wrappers
 * @param {boolean} options.workspaces
 * @param {boolean} [options.publish]
 * @param {boolean} [options.watch]
 * @param {boolean} [options.ignoreTypes]
 * @param {boolean} [options.centralizePackages]
 * @param {boolean} [options.centralizeWrappers]
 * @param {{src: string, snap: string}} options.pkg
 */
export function mergeExports(options: {
    src: string[];
    main: string;
    dist: string;
    preserveExtensions: boolean;
    wrappers: boolean;
    workspaces: boolean;
    publish?: boolean;
    watch?: boolean;
    ignoreTypes?: boolean;
    centralizePackages?: boolean;
    centralizeWrappers?: boolean;
    pkg: {
        src: string;
        snap: string;
    };
}): Promise<void>;
