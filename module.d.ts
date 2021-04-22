/**
 * @param {object} config
 * @param {string} config.src
 * @param {string} config.dest
 * @param {boolean} config.types
 * @param {boolean} config.exports
 * @param {(config:import("esbuild").BuildOptions)=>import("esbuild").BuildOptions} [config.preload]
 * @returns
 */
export function prepare(config: {
    src: string;
    dest: string;
    types: boolean;
    exports: boolean;
    preload?: ((config: import("esbuild").BuildOptions) => import("esbuild").BuildOptions) | undefined;
}): Promise<void>;
