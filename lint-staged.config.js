module.exports = {
  '*': [
    'bun --bun biome format --write --no-errors-on-unmatched --files-ignore-unknown=true',
    'bun --bun biome lint --write --unsafe --no-errors-on-unmatched --files-ignore-unknown=true',
  ],
  '**/package.json': ['bun --bun sort-package-json'],
};
