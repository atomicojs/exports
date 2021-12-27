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
                const outputParts = output.split("/");
                const parsedPath = path.parse(output);
                const { name } =
                    outputParts.length > 2
                        ? { name: outputParts.at(-2) }
                        : parsedPath.name == "index"
                        ? { name: main }
                        : parsedPath;
                const relativeOutput = addDotRelative(output);
                let prop = "./" + name;
                if (name == main) {
                    prop = ".";
                    pkg.module = relativeOutput;
                }
                return {
                    ...exports,
                    [prop]: relativeOutput,
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
            const outputParts = output.split("/");
            const parsedPath = path.parse(output);
            const { name } =
                outputParts.length > 2
                    ? { name: outputParts.at(-2) }
                    : parsedPath.name == "index"
                    ? { name: main }
                    : parsedPath;
            const id = name.replace(/\.d$/, "");
            if (id == main) {
                pkg.types = output;
            }
            all[id] = [addDotRelative(output)];
            return all;
        }, prevAll);

    pkg.typesVersions = typesVersions;
}
/**
 *
 * @param {Object<string,any>} pkg
 * @param {Object<string,any>} external
 * @param {"dependencies"|"devDependencies"|"peerDependencies"|"peerDependenciesMeta"} [type]
 */
export function setPkgDependencies(pkg, external, type = "dependencies") {
    const deps = pkg[type] || {};
    for (const prop in external) {
        if (!deps[prop]) {
            const [first] =
                external[prop] instanceof Set
                    ? [...external[prop]]
                    : [].concat(external[prop]);
            deps[prop] = first;
        }
    }
    pkg[type] = deps;
}
