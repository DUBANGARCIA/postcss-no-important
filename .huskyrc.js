module.exports = {
  hooks: {
    'pre-commit': 'yarn lint-staged -c lint-staged.config.js --relative',
    'commit-msg': 'yarn commitlint --edit $1',
    'post-checkout': 'yarn yarnhook',
    'post-merge': 'yarn yarnhook',
    'post-rewrite': 'yarn yarnhook',
  },
};
