# @atomico/prepare

**🧪experimental**

It allows to generate an export to quickly publish components created with Atomico in NPM.

```json
{
    "prepare": "prepare components/*.jsx --types --exports"
}
```

The Command will find all the components that match the expecion and will send them to esbuild:

1. `--types`: generates the types, this flag requires the installation of Typescript.
2. `--exports`: update the package.json#exports associating the exports.
