# CLAUDE.md

Guidance for Claude (and other AI agents) working in this repository. Mirrors the
human-facing `WARP.md` and codifies the conventions enforced by tooling.

## Stack

- **Language:** TypeScript (strict mode). All new code must be strictly typed.
- **Runtime / package manager:** [Bun](https://bun.sh). Node.js, npm, yarn, and
  pnpm are intentionally disabled via `package.json` engines.
- **Toolchain manager:** [mise](https://mise.jdx.dev) — pins Bun, Node, and
  aqua-installed binaries (`lefthook`, `shellcheck`, `act`, `actionlint`).
- **Linter & formatter:** [Biome](https://biomejs.dev). Do **not** introduce
  ESLint or Prettier — Biome is the single source of truth (see
  [BRA-3837](https://paperclip/BRA/issues/BRA-3837)).
- **Tests:** [Vitest](https://vitest.dev), executed with `bun vitest`.
- **Build:** [tsup](https://tsup.egoist.dev) emitting dual ESM (`.mjs`) +
  CJS (`.cjs`) bundles.
- **Git hooks:** [lefthook](https://github.com/evilmartians/lefthook) drives
  `pre-commit` (format → lint → sort-package-json → taplo → actionlint) and
  `commit-msg` (commitlint).

## Setup

```bash
mise install        # provisions Bun, Node, and aqua tools
lefthook install    # registers git hooks
bun install         # installs JS dependencies (uses bun.lock)
```

`bun install` also runs the `prepare` script, which auto-installs lefthook hooks
when not in CI.

## Common commands

```bash
# Tests
bun test                  # run the suite once
bun test:watch            # watch mode
bun test:coverage         # with coverage report

# Type checking
bun run type-check        # tsc --noEmit

# Lint & format (Biome)
bun --bun biome format --write .
bun --bun biome lint --write .

# Build
bun run build:release     # produces ./dist (ESM + CJS + d.ts)

# Commit (interactive, conventional commits)
bun run commit            # uses git-czg / cz-git
```

## Commit conventions

Conventional Commits, enforced by `commitlint` with
`@commitlint/config-conventional` and the project rules in
`commitlint.config.js`.

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `build`, `ci`, `chore`, `revert`.
- **Allowed scopes:** `workspace`, `config`, `plugin` (multiple scopes may be
  comma-separated).
- **Subject:** short, imperative, lower-case, ≤ 100 chars.
- Prefer `bun run commit` to author messages — the prompt enforces the rules
  above and supports emoji prefixes.

`feat:` and `fix:` are the only types that may declare breaking changes.

## Branching (git flow)

- **`develop`** — default integration branch. PRs target `develop`.
- **`main` / `master`** — release branch; updated by the release process only.
- **Feature branches:** `feat/<slug>` or `feature/<slug>` off `develop`.
- **Fix branches:** `fix/<slug>` off `develop`; `hotfix/<slug>` off `main` for
  production hotfixes.
- **Chore / docs / CI:** `chore/<slug>`, `docs/<slug>`, `ci/<slug>` off
  `develop`.
- Never push directly to `develop` or `main` — always open a PR. Squash- and
  rebase-merge are disabled at the repo level; merge commits only.

## Definition of done for a PR

1. `bun --bun biome format --write .` and `bun --bun biome lint --write .` are
   clean (the pre-commit hook normally runs both).
2. `bun run type-check` passes.
3. `bun test` passes; coverage thresholds in `vitest.config.ts` are met for
   changes that affect them.
4. Commit messages follow Conventional Commits.
5. PR targets `develop` (or `main` only for hotfixes / release PRs).
6. CI is green.

## Things not to do

- Do **not** add or switch to ESLint, Prettier, npm, yarn, or pnpm.
- Do **not** edit files under `dist/` — it is build output.
- Do **not** bypass `lefthook` (`--no-verify`) unless the user explicitly
  authorises it; fix the underlying lint/type/test failure instead.
- Do **not** bump versions or write to `CHANGELOG.md` by hand — `release-it`
  with `@release-it/conventional-changelog` owns that.

## References

- `WARP.md` — sibling guidance for WARP, kept in sync with this file.
- `biome.json`, `lefthook.yaml`, `commitlint.config.js`, `mise.toml`,
  `tsup.config.ts`, `vitest.config.ts` — authoritative tool configs.
- [BRA-8](https://paperclip/BRA/issues/BRA-8) §11 — repo-level CLAUDE.md /
  AGENTS.md policy.
- [BRA-3837](https://paperclip/BRA/issues/BRA-3837) — Biome over ESLint /
  Prettier decision.
