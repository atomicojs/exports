# Testing

This workspace is automated and in CLI integration format, the idea is that each case can be replicated as an isolated package.

The idea is to compare the generated content with the backed up content.

Each new package must be added to [config](./config.js), associating the files that are to be compared.

Backups are generated using the script `npm run test:generate-expects`.
