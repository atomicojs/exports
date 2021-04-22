# @atomico/exports

**🧪Experimental.**

Runs a series of repetitive processes when exporting packages to NPM.

1. Generate the code export using expressions.
2. Add the files to the exported codes to package.json#exports
3. Generate the types of the exproted files, The `--types` flag requires the installation of Typescript.

the files to export are generated thanks to [Esbuild](https://esbuild.github.io/).

```json
{
    "exports": "exports components/*.jsx --types --exports"
}
```

### flags

```
Options:
  --dest <dest>      Choose a project type
  --types            Generate the .d.ts files in root using typescript
  --exports          Add the output files to package.json#exports
  --minify           minify the code output
  --watch            Enable the use of watch in esbuild
  --target <target>  Defines the target to associate for the output
  --sourcemap        generate the sourcemap
  -v, --version      Display version number
  -h, --help         Display this message

Examples:
prepare components/*.jsx
prepare components/*.jsx --types
prepare components/*.jsx --exports
prepare components/*.jsx --types --exports
```
