import ts from "typescript";
import { TSCONFIG } from "./constants.js";
import { require, addDotRelative } from "./utils.js";
/**
 * @param {string[]} entries
 * @param {Files} files
 * @param {{ts.CompilerOptions}} options
 * @returns {ts.LanguageServiceHost }
 */
const createServiceHost = (entries, files, options) => ({
    getScriptFileNames: () => entries,
    getScriptVersion: (fileName) =>
        files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
        // if (!fs.existsSync(fileName)) {
        //     return undefined;
        // }
        if (!ts.sys.fileExists(fileName)) {
            return undefined;
        }

        return ts.ScriptSnapshot.fromString(
            // fs.readFileSync(fileName).toString()
            ts.sys.readFile(fileName)
        );
    },
    getCurrentDirectory: () => process.cwd(),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
});

/**
 *
 * @param {string} [file]
 * @returns
 */
const getOptions = (file) => {
    file = file || ts.findConfigFile("./", ts.sys.fileExists);

    const configFile = ts.readJsonConfigFile(file, ts.sys.readFile);

    let { options, raw } = ts.parseJsonSourceFileConfigFileContent(
        configFile,
        ts.sys,
        "./"
    );

    if (raw?.extends) {
        options = {
            ...getOptions(require.resolve(raw.extends)),
            ...options,
        };
    }

    return options;
};

/**
 *
 * @param {string[]} entries
 * @param {boolean} useExit
 */
export function createService(entries, useExit) {
    /**
     * @type {Files}
     */
    const files = {};

    entries = entries.map(addDotRelative);

    entries.forEach((file) => (files[file] = { version: 0 }));

    const options = {
        ...getOptions(),
        ...TSCONFIG,
    };

    const serviceHost = createServiceHost(entries, files, options);

    const service = ts.createLanguageService(
        serviceHost,
        ts.createDocumentRegistry()
    );

    function getErros(fileName) {
        let allDiagnostics = service
            .getCompilerOptionsDiagnostics()
            .concat(service.getSyntacticDiagnostics(fileName))
            .concat(service.getSemanticDiagnostics(fileName));

        return allDiagnostics.map((diagnostic) => {
            let message = ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            );
            if (diagnostic.file) {
                let { line, character } =
                    diagnostic.file.getLineAndCharacterOfPosition(
                        diagnostic.start
                    );

                return `Error ${diagnostic.file.fileName} (${line + 1},${
                    character + 1
                }): ${message}`;
            } else {
                return `Error: ${message}`;
            }
        });
    }

    return {
        service,
        /**
         *
         * @param {string[]} change
         * @return {string[]}
         */
        output(change = []) {
            change
                .map(addDotRelative)
                .forEach((file) => files[file] && files[file].version++);

            const errors = entries.map(getErros).flat(2);

            if (errors.length) {
                console.log(errors.map((error) => ` ${error}`).join("\n"));
                if (useExit) process.exit();
                return [];
            } else {
                const outputDts = entries
                    .map((file) => service.getEmitOutput(file).outputFiles)
                    .flat(2)
                    .map(({ name, text }) => {
                        ts.sys.writeFile(name, text);
                        return name;
                    });
                return outputDts;
            }
        },
    };
}

// const service = createService(["./tests/atomico.jsx"]);

// service.output();

/**
 * @typedef {{[file:string]:{version:number}}} Files
 */
