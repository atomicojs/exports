export const TS_CONFIG_FIXED = {
    declaration: true,
    emitDeclarationOnly: true,
    outDir: "./types",
};

export const TS_CONFIG = {
    moduleResolution: "Node",
    target: "ESNext",
    listEmittedFiles: true,
    strict: true,
    jsx: "react-jsx",
    jsxImportSource: "atomico",
    allowJs: true,
    lib: ["ESNext", "DOM", "DOM.Iterable"],
};
