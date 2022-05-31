import glob from "fast-glob";
import { writeFile } from "fs/promises";
import {
    getPackage,
    setPackageExports,
    setPackageTypesVersions,
} from "./utils.js";
/**
 *
 * @param {string} src
 * @param {string} main
 */
export async function createPackageService(src, main) {
    const firstPackage = await getPackage(src);
    const [, , indent] = firstPackage;

    const writePackage = (pkg) =>
        writeFile(src, JSON.stringify(pkg, null, indent));

    return {
        async get() {
            const [pkg] = await getPackage(src);
            return pkg;
        },
        async getExternals() {
            const [{ workspaces = [], ...pkg }] = await getPackage(src);

            const subpackages = {};
            const externals = {};

            const globPkgs = workspaces
                .map((path) => path.replace(/\/\*$/, "/"))
                .map(
                    (path) =>
                        path +
                        (path.endsWith("/") ? "" : "/") +
                        "**/package.json"
                );

            const setSubPackageExternal = (externalProp, prop, value) => {
                subpackages[externalProp] = subpackages[externalProp] || {};
                subpackages[externalProp][prop] = value;
            };

            /**
             *
             * @param {import("./utils").Package} pkg
             */
            const explorer = (pkg) => {
                const externalProps = [
                    "dependencies",
                    "peerDependencies",
                    "peerDependenciesMeta",
                ];

                externalProps.forEach((externalProp) => {
                    Object.entries(pkg[externalProp] || {}).map(
                        ([prop, value]) => {
                            if (externalProp !== "peerDependenciesMeta") {
                                externals[prop] = value;
                            }
                            setSubPackageExternal(externalProp, prop, value);
                        }
                    );
                });
            };

            explorer(pkg);

            if (globPkgs.length) {
                const packages = await glob(globPkgs, {
                    ignore: ["node_modules"],
                });

                packages
                    .map(async (file) => {
                        const [pkg] = await getPackage(file);
                        return pkg;
                    })
                    .map(explorer);
            }

            return [externals, subpackages];
        },
        /**
         *
         * @param {"dependencies"|"peerDependencies"} mode
         * @param {Object<string,string>} dependencies
         */
        async set(type, value) {
            if (!value) return;

            const [pkg] = await getPackage(src);

            const { [type]: currentValue = {} } = pkg;

            switch (type) {
                case "exports":
                    setPackageExports(pkg, value, main);
                    break;
                case "types":
                    setPackageTypesVersions(pkg, value, main);
                    break;
                default:
                    pkg[mode] = Object.entries(value).reduce(
                        (currentValue, [prop, value]) => ({
                            ...currentValue,
                            [prop]: value,
                        }),
                        currentValue
                    );
            }

            writePackage(pkg);
        },
    };
}
