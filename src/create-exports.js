import { createWrappers, peerDependencies } from "./create-wrapper.js";
import { createCentralizePackages } from "./create-centralize-packages.js";
import { cleanPath, getModules, isJs, isTsDeclaration } from "./utils.js";

/**
 * @param {object} options
 * @param {string[]} options.input
 * @param {Pkg} options.pkg
 * @param {string} [options.main]
 * @param {string} [options.dist]
 * @param {boolean} [options.wrappers]
 * @param {boolean} [options.ignoreTypes]
 * @param {boolean} [options.centralizePackages]
 * @param {boolean} [options.centralizeWrappers]
 * @param {boolean} [options.assets]
 */
export async function createExports(options) {
    const meta = {};

    const filesJs = getModules(options.input.filter(isJs));

    const filesAssets = getModules(
        options.input.filter((file) => !isJs(file) && !isTsDeclaration(file)),
        true
    );

    const filesDTs = getModules(
        options.input.filter((file) => file.endsWith(".d.ts"))
    ).map(([name, file]) => [name.replace(/\.d\.ts$/, ""), file]);

    const filesTs = options.ignoreTypes
        ? []
        : filesDTs.length
        ? filesDTs
        : [...filesJs];

    const main = options.main || filesJs?.[0]?.[0];

    let fileMainJs = main && filesJs.find(([name]) => name === main);
    let fileMainTs =
        main &&
        filesTs.find(([name]) =>
            name === "" ? "index" === main : name === main
        );

    const wrappers = options.wrappers
        ? await createWrappers({
              input: filesJs,
              scope: options.pkg.name,
              dist: options.dist,
              centralizeWrappers: options.centralizeWrappers,
              main,
          })
        : [];
    if (options.centralizePackages) {
        const { dependencies, wrappers: _wrappers } =
            await createCentralizePackages({
                input: options.input,
                scope: options.pkg.name,
                dist: options.dist,
                wrappers: options.wrappers,
            });

        wrappers.push(..._wrappers);

        meta.dependencies = dependencies.reduce(
            (current, { name, version }) => ({
                ...current,
                [name]: `^${version}`,
            }),
            options.pkg?.dependencies || {}
        );

        const [{ fileDistTs, fileDistJs }] = _wrappers;

        fileMainJs = ["", fileDistJs];
        fileMainTs = ["", fileDistTs];
    }

    if ((options.wrappers || options.centralizePackages) && wrappers.length) {
        wrappers.forEach(({ fileExport, fileDistTs, fileDistJs }) => {
            fileDistJs && filesJs.push([fileExport, fileDistJs]);
            fileDistTs && filesTs.push([fileExport, fileDistTs]);
        });

        meta.peerDependencies = peerDependencies.reduce(
            (current, { name, version }) => ({
                ...current,
                [name]: version,
            }),
            options.pkg?.peerDependencies || {}
        );

        meta.peerDependenciesMeta = peerDependencies.reduce(
            (current, { name }) => ({
                ...current,
                [name]: { optional: true },
            }),
            options.pkg?.peerDependenciesMeta || {}
        );
    }

    if (fileMainJs) {
        const [, distJs] = fileMainJs;
        meta.main = distJs;
        meta.module = distJs;
        filesJs.push([".", distJs]);
    }

    /**
     * @type {Object<string,string>}
     */
    const filesTsByPath = filesTs.reduce(
        (current, [path, file]) => ({
            ...current,
            [path]: file,
        }),
        {}
    );

    if (fileMainTs) {
        const [, distTs] = fileMainTs;
        meta.types = distTs;
        filesTsByPath["."] = distTs;
    }

    if (filesAssets.length) filesJs.push(...filesAssets);

    return {
        pkg: {
            ...meta,
            exports: filesJs.reduce(
                (current, [path, file]) => ({
                    ...current,
                    [cleanPath(
                        formatFirstDot(
                            path.startsWith(".") ? path : `./${path}`
                        )
                    )]: {
                        default: formatFirstDot(file),
                        ...(filesTsByPath[path]
                            ? { types: formatFirstDot(filesTsByPath[path]) }
                            : {}),
                    },
                }),
                options.pkg?.exports || {}
            ),
            typesVersions: {
                ...options.pkg?.typesVersions,
                "*": filesTs
                    .filter(([name]) => name)
                    .reduce(
                        (current, [path, file]) => ({
                            ...current,
                            [cleanPath(path, { relative: true })]: [file],
                        }),
                        options.pkg?.typesVersions?.["*"] || {}
                    ),
            },
        },
        wrappers,
    };
}

/**
 * @param {string} path
 * @returns {string}
 */
const formatFirstDot = (path) => (path.startsWith(".") ? path : `./${path}`);

/**
 * @typedef {object}  Pkg
 * @property {string} Pkg.name
 * @property {string} Pkg.version
 * @property {string[]} Pkg.workspaces
 * @property {{[src:string]:string}}  [Pkg.exports]
 * @property {{[src:string]:string}}  [Pkg.dependencies]
 * @property {{[src:string]:string}}  [Pkg.peerDependencies]
 * @property {{[src:string]:{optional:boolean}}}  [Pkg.peerDependenciesMeta]
 * @property {{[src:string]:{[src:string]:string[]}}}  [Pkg.typesVersions]
 */
