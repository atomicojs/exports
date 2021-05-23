import esbuild from "esbuild";

export async function loadCss({ share, src, dest }) {
    const { outdir, ...config } = share;

    const { outputFiles } = await esbuild.build({
        ...config,
        entryPoints: [src],
        outfile: dest,
        write: false,
    });

    const [{ contents }] = outputFiles;

    return {
        inline: [
            `import { css } from "atomico"`,
            `export default css\`${new TextDecoder("utf-8").decode(
                contents
            )}\``,
            "",
        ].join(";\n"),
    };
}
