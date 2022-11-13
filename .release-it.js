module.exports = {
  hooks: {
    'before:init': ['yarn clear-package-json ./package.json -o ./package.json --fields scripts'],
  },
  git: {
    // eslint-disable-next-line no-template-curly-in-string
    commitMessage: 'chore(workspace): 🤖 release ${version}',
    requireCommits: true,
    // eslint-disable-next-line no-template-curly-in-string
    tagName: '${version}',
    tag: true,
    push: true,
    requireUpstream: false,
  },
  github: {
    release: true,
    // eslint-disable-next-line no-template-curly-in-string
    releaseName: 'Release ${version}',
    tokenRef: 'PERSONAL_GITHUB_TOKEN'
  },
  npm: {
    publish: true,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
    },
  },
};
