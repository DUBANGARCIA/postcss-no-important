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
