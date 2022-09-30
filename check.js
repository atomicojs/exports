import { createExports } from "./src/create-exports.js";

const pkg = await createExports({
    input: ["./dist/atomico.js"],
    main: "atomico",
    pkg: {
        name: "@demo",
    },
});

console.log(pkg);
