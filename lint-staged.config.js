module.exports = {
  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}': [
    'pnpm biome format --write --no-errors-on-unmatched --staged', // Format
    'pnpm biome lint --no-errors-on-unmatched --apply-unsafe --staged', // Lint and apply safe fixes
  ],
  '*': [
    'pnpm biome format --write --no-errors-on-unmatched --files-ignore-unknown=true', // Check formatting and lint
    'pnpm biome lint --no-errors-on-unmatched --files-ignore-unknown=true', // Check formatting and lint
  ],
};
