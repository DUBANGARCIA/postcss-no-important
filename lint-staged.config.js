module.exports = {
  '*': [
    'pnpm biome format --write --no-errors-on-unmatched --files-ignore-unknown=true',
    'pnpm biome lint --write --unsafe --no-errors-on-unmatched --files-ignore-unknown=true',
  ],
  '**/package.json': ['pnpm sort-package-json'],
};
