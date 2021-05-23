import { readFile } from "fs/promises";
import test from "ava";
import { prepare } from "../src/module.js";

test("simple build", async (t) => {
    await prepare({
        src: "tests/example.js",
        dest: "tests/dest",
        minify: true,
    });
    t.is(
        await readFile("./tests/dest/example.js", "utf-8"),
        await readFile("./tests/expect-example.txt", "utf-8")
    );
});

test("simple build jsx", async (t) => {
    await prepare({
        src: "tests/atomico.jsx",
        dest: "tests/dest",
        minify: true,
    });
    t.is(
        await readFile("./tests/dest/atomico.js", "utf-8"),
        await readFile("./tests/expect-atomico.txt", "utf-8")
    );
});
