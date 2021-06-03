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
