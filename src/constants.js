export const TS_CONFIG = {
    moduleResolution: "Node",
    target: "ESNext",
    listEmittedFiles: true,
    strict: true,
    jsx: "react-jsx",
    jsxImportSource: "atomico",
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    outDir: "./types",
    lib: ["ESNext", "DOM", "DOM.Iterable"],
};
