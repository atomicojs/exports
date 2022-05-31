import { prepare } from "./src/module.js";

prepare({
    src: "./tests/atomico.jsx",
    dist: "./dist",
    watch: true,
    exports: true,
});
