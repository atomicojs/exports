import test from "node:test";
import assert from "node:assert";
import glob from "fast-glob";
import { readFile } from "node:fs/promises";
import { EXPECTS, PACKAGE, PACKAGE_EXPECTS } from "./config.js";

const replaceLine = (value) => value.replace(/\r\n/g, "\n");

EXPECTS.map(({ src }) => {
    test(src, async () => {
        (
            await glob(
                "tests/" + src.replace(PACKAGE, PACKAGE_EXPECTS) + "/**/*"
            )
        ).map(async (file) => {
            assert.equal(
                replaceLine(await readFile(file, "utf8")),
                replaceLine(
                    await readFile(
                        file.replace(PACKAGE_EXPECTS, PACKAGE),
                        "utf8"
                    )
                )
            );
        });
    });
});
