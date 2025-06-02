module.exports = {
  hooks: {
    'after:@release-it/conventional-changelog:bump': "bun --bun clean-publish --fields 'scripts'",
    'after:release': 'rm -rf ./dist > /dev/null',
  },
  git: {
    requireCleanWorkingDir: true,
    commitMessage: 'chore(workspace): 🤖 release ${version}',
    requireCommits: true,
    tagName: '${version}',
    tag: true,
    push: true,
  },
  github: {
    release: true,
    releaseName: 'Release ${version}',
    tokenRef: 'GITHUB_TOKEN',
  },
  npm: {
    publish: true,
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
