import builtins from "builtin-modules";
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
};
