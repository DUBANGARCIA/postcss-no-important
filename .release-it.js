module.exports = {
  hooks: {
    'before:@release-it/conventional-changelog:bump': 'bun run type-check && bun run build:release',
    'after:@release-it/conventional-changelog:bump':
      "bun --bun clean-publish --fields 'scripts,engines'",
    'after:release': 'rm -rf ./dist > /dev/null',
  },
  git: {
    requireCleanWorkingDir: true,
    // biome-ignore lint/suspicious/noTemplateCurlyInString: release-it placeholder
    commitMessage: 'chore(workspace): 🤖 release ${version}',
    requireCommits: true,
    // biome-ignore lint/suspicious/noTemplateCurlyInString: release-it placeholder
    tagName: '${version}',
    tag: true,
    push: true,
  },
  github: {
    release: true,
    // biome-ignore lint/suspicious/noTemplateCurlyInString: release-it placeholder
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
