import { prepare } from "./src/module.js";

prepare({
    src: "./tests/atomico.jsx",
    dist: "./dist",
    watch: true,
    analyzer: true,
    exports: true,
    type: true,
});
