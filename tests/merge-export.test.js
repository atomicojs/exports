import test from "ava";
import { mergeExports } from "../src/merge-exports.js";
import { readFile } from "fs/promises";
import glob from "fast-glob";

test("module/atomico", async (t) => {
    const snapPkg = await readFile("./tests/module/package.json", "utf8");

    await mergeExports({
        main: "atomico",
        src: ["./tests/module/**"],
        dist: "./tests/dist/module",
        wrappers: true,
        pkg: {
            src: "./tests/dist/module/package.json",
            snap: snapPkg,
        },
    });

    const baseExpect = "./tests/expect";

    const baseDist = "./tests/dist";

    const filesExpect = await glob(`${baseExpect}/**`);

    const filesDist = (await glob(`${baseDist}/**`)).reduce(
        (files, file) => ({
            ...files,
            [file.replace(baseDist, "")]: file,
        }),
        {}
    );

    await Promise.all(
        filesExpect.map(async (file) =>
            t.is(
                await readFile(file, "utf8"),
                await readFile(filesDist[file.replace(baseExpect, "")], "utf8")
            )
        )
    );
});
