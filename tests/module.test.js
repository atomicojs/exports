import { readFile } from "fs/promises";
import test from "ava";
import { prepare } from "../src/module.js";

test("simple replace", async (t) => {
    await prepare({
        src: "tests/example.js",
        dest: "tests/dest",
    });
    t.is(
        (await readFile("./tests/dest/example.js", "utf-8")).trim(),
        (await readFile("./tests/example.js", "utf-8")).trim()
    );
});
