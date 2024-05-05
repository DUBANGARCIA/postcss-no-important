// biome-ignore lint/style/noDefaultExport: This export is required for the use of the plug-in in the PostCSS ecosystem.
export default () => ({
  postcssPlugin: 'postcss-no-important',
  Declaration: (decl) => {
    // Transform each property declaration here
    const value = decl.important;
    if (value) {
      decl.important = false;
    }
  },
});

export const postcss = true;
