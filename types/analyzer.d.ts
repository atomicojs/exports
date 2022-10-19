/**
 * @param {Object} options
 * @param {string} options.pkgName
 * @param {string} options.dist
 * @param {string} options.main
 * @param {string} options.customElements
 * @param {string[]} options.entryPoints
 * @param {boolean} options.types
 * @param {boolean} options.types
 * @param {boolean} options.exports
 */
export function analyzer({ pkgName, dist, entryPoints, ...options }: {
    pkgName: string;
    dist: string;
    main: string;
    customElements: string;
    entryPoints: string[];
    types: boolean;
    types: boolean;
    exports: boolean;
}): Promise<any[][]>;
