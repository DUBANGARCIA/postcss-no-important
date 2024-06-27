module.exports = {
  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}': [
    'pnpm biome format --write --no-errors-on-unmatched',
    'pnpm biome lint --no-errors-on-unmatched --apply-unsafe',
  ],
  '*': [
    'pnpm biome format --write --no-errors-on-unmatched --files-ignore-unknown=true --staged',
    'pnpm biome lint --no-errors-on-unmatched --files-ignore-unknown=true --staged',
  ],
  'package.json': ['pnpm sort-package-json'],
};
