module.exports = {
  hooks: {
    'before:npm': "yarn clean-publish --fields 'scripts'",
    'after:npm': 'rm -rf ./dist > /dev/null',
  },
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    requireCleanWorkingDir: true,
    commitMessage: 'chore(workspace): 🤖 release ${version}',
    requireCommits: true,
    // eslint-disable-next-line no-template-curly-in-string
    tagName: '${version}',
    tag: true,
    push: true,
  },
  github: {
    release: true,
    // eslint-disable-next-line no-template-curly-in-string
    releaseName: 'Release ${version}',
    tokenRef: 'GITHUB_TOKEN',
  },
  npm: {
    publish: false,
    publishPath: './dist',
  },
  publishConfig: {
    registry: 'https://registry.npmjs.org',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
    },
  },
};
