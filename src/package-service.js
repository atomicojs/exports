import { writeFile } from "fs/promises";
import { getPackage, setPackageExports } from "./utils.js";
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
        async getExternals() {
            const [
                { workspaces = [], dependencies = {}, peerDependencies = {} },
            ] = await getPackage(src);

            const externals = [
                ...Object.keys(dependencies),
                ...Object.keys(peerDependencies),
            ].reduce(
                (external, prop) => ({
                    ...external,
                    [prop]: dependencies[prop] || peerDependencies[prop],
                }),
                {}
            );

            return externals;
        },
        /**
         *
         * @param {"dependencies"|"peerDependencies"} mode
         * @param {Object<string,string>} dependencies
         */
        async set(type, value) {
            const [pkg] = await getPackage(src);
            const { [type]: currentValue = {} } = pkg;

            switch (type) {
                case "exports":
                    setPackageExports(pkg, value, main);
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
