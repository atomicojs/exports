import cac from "cac";
import { prepare } from "./module.js";
export { prepare } from "./module.js";

const cli = cac("devserver").version("PKG.VERSION");

cli.command("[...files]", "Build files")
    .option("--dest", "Choose a project type")
    .option("--types", "Choose a project type")
    .option("--exports", "")
    .action((src, { dest = "dest", types = false, exports = false }) => {
        prepare({ src, dest, types, exports });
    });

cli.help();

cli.parse();
