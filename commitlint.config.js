module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'header-max-length': [2, 'always', 120],
    'body-leading-blank': [1, 'never'],
    'header-min-length': [2, 'always', 3],
    'function-rules/scope-enum': [
      2,
      'always',
      (parsed) => {
        const allowedScopes = ['workspace', 'plugin'];

        if (!parsed.scope || allowedScopes.includes(parsed.scope)) {
          return [true];
        }

        return [false, `scope must be one of ${allowedScopes.join(', ')}`];
      },
    ],
    'scope-empty': [2, 'never'],
    'scope-min-length': [2, 'always', 3],
    'header-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'sentence-case'],
  },
};
