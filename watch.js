import { prepare } from "./src/module.js";

prepare({
    src: "./tests/atomico.jsx",
    dist: "./dist",
    // analyzer: true,
    // exports: true,
    // types: true,
});
