import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const isJs = (file) => /\.(js|jsx|mjs|ts|tsx)$/.test(file);

export async function write(dest, content) {
    const { dir } = path.parse(dest);
    try {
        await mkdir(dir, { recursive: true });
    } finally {
        return writeFile(dest, content);
    }
}

export const addDotRelative = (file) =>
    file.startsWith("./") ? file : "./" + file;

/**
 * @param {object} pkg
 * @param {string[]} outputs
 */
export function setPkgExports(pkg, outputs, main) {
    pkg.exports = outputs
        .filter((output) => /\.(css|js|mjs)$/.test(output))
        .reduce(
            (exports, output) => {
                const { name } = path.parse(output);
                const prop = name == main ? "." : "./" + name;
                return {
                    ...exports,
                    [prop]: addDotRelative(output),
                };
            },
            {
                ...pkg.exports,
            }
        );
}

export function setPkgTypesVersions(pkg, outputs, main) {
    const { typesVersions = {} } = pkg;

    const prevAll = typesVersions["*"] || {};

    typesVersions["*"] = outputs
        .filter((output) => /\.d\.ts$/.test(output))
        .reduce((all, output) => {
            const { name } = path.parse(output);
            const id = name.replace(/\.d$/, "");
            if (id == main) {
                pkg.types = output;
            }
            all[id] = [addDotRelative(output)];
            return all;
        }, prevAll);

    pkg.typesVersions = typesVersions;
}

export function setPkgDependencies(pkg, external) {
    const { dependencies = {} } = pkg;
    for (const prop in external) {
        if (!dependencies[prop]) {
            const [first] = [...external[prop]];
            dependencies[prop] = first;
        }
    }
    pkg.dependencies = dependencies;
}
