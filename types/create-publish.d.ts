/**
 *
 * @param {string} localVersion
 * @returns {Promise<{status:"ignore"|"publish"|"error", error?: string}>}
 */
export function createPublish(localVersion: string): Promise<{
    status: "ignore" | "publish" | "error";
    error?: string;
}>;
