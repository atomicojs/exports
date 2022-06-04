import { exec } from "child_process";
import { promisify } from "util";

const command = promisify(exec);

/**
 *
 * @param {string} localVersion
 * @returns {Promise<ReturnType<command>|undefined>}
 */
export async function publish(localVersion) {
    const versions = [];
    try {
        const { stdout } = await command("npm dist-tag");
        stdout.replace(/: +(.+)/gm, (all, version) => versions.push(version));
    } catch (e) {}

    if (!versions.includes(localVersion)) {
        return command("npm publish");
    }
}
