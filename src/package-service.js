import { writeFile } from "fs/promises";
import { getPackage } from "./utils";

/**
 *
 * @param {string} src
 */
export async function createPackageService(src) {
    const firstPackage = await getPackage(src);
    const [, , indent] = firstPackage;

    const writePackage = (json) =>
        writeFile(src, JSON.stringify(json, null, indent));

    return {
        async getExternals() {
            const [{ dependencies = {}, peerDependencies = {} }] =
                await getPackage(src);

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
            const [json] = await getPackage(src);
            const { [type]: currentValue = {} } = json;

            json[mode] = Object.entries(value).reduce(
                (currentValue, [prop, value]) => ({
                    ...currentValue,
                    [prop]: value,
                }),
                currentValue
            );

            writePackage(json);
        },
    };
}
