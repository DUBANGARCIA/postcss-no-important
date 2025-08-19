import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: false,
    clean: true,
    outDir: 'dist',
    target: 'node20',
    platform: 'node',
    external: ['postcss'],
    treeshake: true,
    minify: true,
    outExtension: () => ({ js: '.mjs' }),
    esbuildOptions(options) {
      options.supported = {
        'top-level-await': true,
      };
    },
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: false,
    sourcemap: false,
    outDir: 'dist',
    target: 'node20',
    platform: 'node',
    external: ['postcss'],
    treeshake: true,
    minify: true,
    outExtension: () => ({ js: '.cjs' }),
  },
]);
