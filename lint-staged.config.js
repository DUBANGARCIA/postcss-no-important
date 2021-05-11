/* eslint-disable unicorn/prefer-module */
module.exports = {
  '*.js': [
    'yarn prettier -w src',
    'yarn eslint --config .eslintrc.js --fix --cache "src/**"',
    'git add .',
  ],
  '*.{json,scss,css,md,html,ejs}': ['yarn prettier -w src', 'git add .'],
};
