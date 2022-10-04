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

/**
 * @param {string[]} files
 */
export const getModules = (files) => {
    const metaFiles = files.map((file) => ({ ...parse(file), file }));

    const tree = metaFiles.reduce((tree, file) => {
        const value = file.dir
            .replace(/^\.\//g, "")
            .split(/\/|\\/)
            .reduce((tree, index) => {
                tree[index] = tree[index] || {};
                return tree[index];
            }, tree);
        value["/"] = value["/"] || [];
        value["/"].push(file);
        return tree;
    }, {});

    const modules = [];

    const getPath = (tree, parent = [], branch) => {
        const { ["/"]: children, ...index } = tree;

        const entries = Object.entries(index);

        if (
            (!branch && !children?.length && entries.length) ||
            (!entries.length && !branch)
        ) {
            parent = [];
        }

        if (children) {
            modules.push(
                ...children.map(({ name, file }) => [
                    (name === "index" ? parent : [...parent, name]).join("/"),
                    file,
                ])
            );
        }

        entries.forEach(([index, value]) =>
            getPath(
                value,
                [...parent, index],
                entries.length > 1 ? true : branch
            )
        );
    };

    getPath(tree);

    return modules;
};
