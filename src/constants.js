export const TS_CONFIG_FIXED = {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: "./types",
    listEmittedFiles: true,
};

export const TS_CONFIG = {
    moduleResolution: "Node",
    target: "ESNext",
    strict: true,
    jsx: "react-jsx",
    jsxImportSource: "atomico",
    allowJs: true,
    lib: ["ESNext", "DOM", "DOM.Iterable"],
};
