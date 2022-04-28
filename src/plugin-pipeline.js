import path from "path";
import { pipeline, cssLiterals, jsxRuntime } from "@atomico/pipeline";
import { readFile } from "fs/promises";
/**
 * @param {{minify:boolean}} options
 * @returns {import("esbuild").Plugin}
 */
export const pluginPipeline = (options) => ({
    name: "atomico-pipeline",
    setup(build) {
        build.onLoad({ filter: /\.(mjs|js|ts|jsx|tsx)$/ }, async (args) => {
            const loader = path.extname(args.path).slice(1);
            const code = await readFile(args.path, "utf8");
            const result = await pipeline(
                { code, path: args.path },
                cssLiterals({ minify: options.minify, postcss: true }),
                jsxRuntime()
            );
            const codeTransform = result.source.toString();
            if (codeTransform != code) {
                return {
                    contents:
                        codeTransform +
                        "\n//# sourceMappingURL=" +
                        result.source.generateMap().toUrl(),
                    loader,
                };
            } else {
                return { contents: code, loader };
            }
        });
    },
});
