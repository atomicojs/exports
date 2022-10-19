/**
 *
 * @param {string} localVersion
 * @returns {Promise<{status:"ignore"|"publish"|"error", error?: string}>}
 */
export function publish(localVersion: string): Promise<{
    status: "ignore" | "publish" | "error";
    error?: string;
}>;
