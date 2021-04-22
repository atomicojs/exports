import builtins from "builtin-modules";
import replace from "@rollup/plugin-replace";
import pkg from "./package.json";

export default {
    input: "./src/cli.js",
    external: Object.keys(pkg.dependencies || {}).concat(builtins),
    output: {
        file: "./cli.cjs",
        format: "cjs",
        sourcemap: true,
        banner: "#!/usr/bin/env node",
    },
    plugins: [
        replace({
            "PKG.NAME": pkg.name,
            "PKG.VERSION": pkg.version,
        }),
    ],
};
