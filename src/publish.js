import { exec } from "child_process";
import { promisify } from "util";

const command = promisify(exec);

const getVersions = async (versions = []) => {
    const { stdout } = await command("npm dist-tag");
    stdout.replace(/: +(.+)/gm, (all, version) => versions.push(version));
};
/**
 *
 * @param {string} localVersion
 * @returns {Promise<{status:"ignore"|"publish"|"error", error?: string}>}
 */
export async function publish(localVersion) {
    const versions = [];

    try {
        await getVersions(versions);
    } catch (e) {}

    if (!versions.includes(localVersion)) {
        const { stderr: error } = await command("npm publish");

        try {
            await getVersions(versions);
        } catch (e) {}

        return {
            status: versions.includes(localVersion) ? "publish" : "error",
            error,
        };
    }

    return {
        status: "ignore",
    };
}
