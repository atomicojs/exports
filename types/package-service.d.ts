/**
 *
 * @param {string} src
 * @param {string} main
 */
export function createPackageService(src: string, main: string): Promise<{
    get(): Promise<import("./utils.js").Package>;
    restore(): void;
    getExternals(): Promise<{}[]>;
    /**
     *
     * @param {"dependencies"|"peerDependencies"} mode
     * @param {Object<string,string>} dependencies
     */
    set(type: any, value: any): Promise<void> | undefined;
}>;
