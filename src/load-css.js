import { readFile } from "fs/promises";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssLoadConfig from "postcss-load-config";
import csso from "csso";

let currentConfig;

export async function loadCss({ share, src }) {
    const { outdir, ...config } = share;

    const postcssConfig = {
        from: src,
        map: false,
    };

    currentConfig =
        currentConfig ||
        postcssLoadConfig(postcssConfig).catch(() => ({
            plugins: [],
        }));

    const { plugins } = await currentConfig;

    const { css } = await postcss([postcssImport(), ...plugins]).process(
        await readFile(src),
        postcssConfig
    );

    const cssText = config.minify ? csso.minify(css).css : css;

    return {
        inline: [
            `import { css } from "atomico"`,
            `export default css\`${cssText
                .replace(/`/g, "\\`")
                .replace(/\${/g, "\\${")}\``,
            "",
        ].join(";\n"),
    };
}
