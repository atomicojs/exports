/**
 *
 * @returns {import("esbuild").Plugin}
 */
export const pluginExternals = (externals) => ({
    name: "exports",
    setup(build) {
        const match = externals.map((name) => RegExp(`^${name}(/.+){0,1}$`));
        build.onResolve({ filter: /^(@|\w+)/ }, (options) =>
            options.importer && match.some((reg) => reg.test(options.path))
                ? { path: options.path, external: true }
                : null
        );
    },
});
