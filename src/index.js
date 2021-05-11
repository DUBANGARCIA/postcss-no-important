// eslint-disable-next-line import/no-default-export
export default () => ({
  postcssPlugin: 'postcss-no-important',
  Declaration: (decl) => {
    // Transform each property declaration here
    const value = decl.important;
    if (value) {
      // eslint-disable-next-line no-param-reassign
      decl.important = false;
    }
  },
});

export const postcss = true;
