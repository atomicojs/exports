/**
 * @param {object} config
 * @param {string} config.src
 * @param {string} config.dist
 * @param {boolean} [config.types]
 * @param {boolean} [config.minify]
 * @param {boolean} [config.watch]
 * @param {boolean} [config.exports]
 * @param {boolean} [config.sourcemap]
 * @param {boolean} [config.format]
 * @param {boolean} [config.ignoreBuild]
 * @param {boolean} [config.bundle]
 * @param {boolean} [config.analyzer]
 * @param {boolean} [config.publish]
 * @param {boolean} [config.cssInline]
 * @param {string} [config.main]
 * @param {string} [config.customElements]
 * @param {string[]} [config.target]
 * @param {string[]} [config.metaUrl]
 * @param {string} [config.globalName]
 * @param {boolean} [config.transform]
 * @param {(config:import("esbuild").BuildOptions)=>import("esbuild").BuildOptions} [config.preload]
 * @param {boolean} [config.cssLiteralsPostcss]
 * @returns
 */
export function prepare(config: {
    src: string;
    dist: string;
    types?: boolean | undefined;
    minify?: boolean | undefined;
    watch?: boolean | undefined;
    exports?: boolean | undefined;
    sourcemap?: boolean | undefined;
    format?: boolean | undefined;
    ignoreBuild?: boolean | undefined;
    bundle?: boolean | undefined;
    analyzer?: boolean | undefined;
    publish?: boolean | undefined;
    cssInline?: boolean | undefined;
    main?: string | undefined;
    customElements?: string | undefined;
    target?: string[] | undefined;
    metaUrl?: string[] | undefined;
    globalName?: string | undefined;
    transform?: boolean | undefined;
    preload?: ((config: import("esbuild").BuildOptions) => import("esbuild").BuildOptions) | undefined;
    cssLiteralsPostcss?: boolean | undefined;
}): Promise<void>;
