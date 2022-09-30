import { parse } from "path";
import { readFile, writeFile, mkdir } from "fs/promises";
import { getValueIndentation } from "@uppercod/indentation";

/**
 *
 * @param {string} dest
 * @param {string} content
 */
export async function write(dest, content) {
    const { dir } = parse(dest);
    try {
        await mkdir(dir, { recursive: true });
    } finally {
        return writeFile(dest, content);
    }
}

/**
 *
 * @param {string} file
 */
export function read(file) {
    return readFile(file, "utf8");
}

/**
 *
 * @param {string} text
 */
export function getJsonIndent(text) {
    const [, indent] = text.match(/^(\s+)"/m);
    return indent ? getValueIndentation(indent) / getValueIndentation(" ") : 4;
}

export const logger = (message) => {
    const date = new Date();
    console.log(`exports: ${date.toLocaleTimeString()} - ${message}`);
};
