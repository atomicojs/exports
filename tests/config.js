export const PACKAGE_EXPECTS = "packages-expects/";

export const PACKAGE = "packages/";

export const EXPECTS = [
    {
        src: `${PACKAGE}/test-1`,
        files: ["package.tmp.json"],
    },
    {
        src: `${PACKAGE}/test-2`,
        files: ["package.tmp.json", "wrapper"],
    },
];
