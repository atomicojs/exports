import { parse } from "path";
import { createWrappers } from "./create-wrapper.js";

/**
 *
 * @param {string} file
 * @returns {[string, string]}
 */
const createFile = (file) => [parse(file).name, file];

/**
 * @param {object} options
 * @param {string[]} options.input
 * @param {Pkg} options.pkg
 * @param {string} [options.main]
 */
export async function createExports(options) {
    const filesJs = options.input
        .filter((file) => file.endsWith(".js"))
        .map(createFile);

    const filesTs = options.input
        .filter((file) => file.endsWith(".d.ts"))
        .map(createFile);

    const wrappers = await createWrappers({
        input: filesJs,
        scope: options.pkg.name,
    });

    wrappers.forEach(({ fileExport, fileDistTs, fileDistJs }) => {
        fileDistJs && filesJs.push([fileExport, fileDistJs]);
        fileDistTs && filesTs.push([fileExport, fileDistTs]);
    });

    const main = options.main || filesJs?.[0]?.[0];

    const fileMainJs = filesJs.find(([name]) => name === main);
    const fileMainTs = filesTs.find(([name]) => name === main);

    const meta = {};

    if (fileMainJs) {
        const [, distJs] = fileMainJs;
        meta.main = distJs;
        meta.module = distJs;
        filesJs.push([".", distJs]);
    }

    if (fileMainTs) {
        const [, distTs] = fileMainTs;
        meta.types = distTs;
    }

    return [
        {
            ...meta,
            exports: filesJs.reduce(
                (current, [path, file]) => ({
                    ...current,
                    [path.startsWith(".") ? path : `./${path}`]: file,
                }),
                options.pkg?.exports || {}
            ),
            typesVersions: {
                ...options.pkg?.typesVersions,
                "*": filesTs.reduce(
                    (current, [path, file]) => ({
                        ...current,
                        [path]: file,
                    }),
                    options.pkg?.typesVersions?.["*"] || {}
                ),
            },
        },
        wrappers,
    ];
}

/**
 * @typedef {object}  Pkg
 * @property {string} Pkg.name
 * @property {{[src:string]:string}}  [Pkg.exports]
 * @property {{[src:string]:string}}  [Pkg.dependencies]
 * @property {{[src:string]:string}}  [Pkg.peerDependencies]
 * @property {{[src:string]:{[src:string]:string[]}}}  [Pkg.typesVersions]
 */
