import ts from "typescript";

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

const getOptions = () => {
    const file = ts.findConfigFile("./", ts.sys.fileExists);

    const configFile = ts.readJsonConfigFile(file, ts.sys.readFile);

    const { options } = ts.parseJsonSourceFileConfigFileContent(
        configFile,
        ts.sys,
        "./"
    );

    return options;
};

/**
 *
 * @param {string[]} entries
 */
export function createService(entries) {
    /**
     * @type {Files}
     */
    const files = {};

    const options = {
        ...getOptions(),
        emitDeclarationOnly: true,
        outDir: "types",
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
        output() {
            const errors = entries.map(getErros).flat(2);
            if (errors.length) {
                console.log(errors.map((error) => ` ${error}`).join("\n"));
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
