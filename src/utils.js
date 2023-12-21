import { mkdir, readFile, writeFile } from "fs/promises";
import { parse } from "path";

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
export function getJsonFormat(text) {
    const test = text
        .replace(/(\n|\r)/g, "")
        .trim()
        .match(/^\{(\s+)\"/);
    let length = text.length;
    let endLine = "";
    while (length--) {
        if (text[length] === "}") break;
        endLine += text[length];
    }

    return {
        indent: test ? test[1] : 4,
        endLine,
    };
}

/**
 *
 * @param {string} message
 */
export const logger = (message) => {
    const date = new Date();
    console.log(`exports: ${date.toLocaleTimeString()} - ${message}`);
};

/**
 *
 * @param {string} path
 * @param {{relative:boolean}} [options]
 * @returns string
 */
export const cleanPath = (path, options) => {
    path = path.replace(/\/+/g, "/");
    path = path === "./" ? "." : path;
    return options?.relative ? path.replace(/^\//, "") : path;
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

    const ids = new Set();

    const getPath = (tree, parent = [], branch) => {
        const { ["/"]: children, ...subtree } = tree;

        const entries = Object.entries(subtree);

        if (!branch) parent = parent.slice(0, -1);

        branch = branch || !!children?.length;

        if (children) {
            modules.push(
                ...children.map(({ name, file, ext }) => {
                    name = ext === ".ts" ? name.replace(/\.d$/, "") : name;

                    const assets = !isJs(ext);

                    let id =
                        (name === "index" || parent[parent.length - 1] === name
                            ? parent
                            : [...parent, name]
                        ).join("/") + (assets ? ext : "");

                    id = ids.has(id) ? [...parent, name].join("/") : id;

                    ids.add(id);

                    return [id, file];
                })
            );
        }

        entries.forEach(([index, value]) =>
            getPath(value, [...parent, index], branch)
        );
    };

    getPath(tree);

    return modules;
};

export const isTsDeclaration = (file) => file.endsWith(".d.ts");

export const isJs = (file) => /\.(ts(x){0,1}|js(x){0,1}|mjs)$/.test(file);
