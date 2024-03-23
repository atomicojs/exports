import { cp, rm } from "node:fs/promises";
import { EXPECTS, PACKAGE, PACKAGE_EXPECTS } from "./config.js";

await rm(new URL(PACKAGE_EXPECTS.replace("/", ""), import.meta.url), {
    force: true,
    recursive: true,
});

await Promise.all(
    EXPECTS.map(({ src, files }) =>
        Promise.all(
            files.map((file) =>
                cp(
                    new URL(`${src}/${file}`, import.meta.url),
                    new URL(
                        `${src.replace(PACKAGE, PACKAGE_EXPECTS)}/${file}`,
                        import.meta.url
                    ),
                    { recursive: true }
                )
            )
        )
    )
);
