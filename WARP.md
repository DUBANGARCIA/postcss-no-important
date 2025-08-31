# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Environment

This project exclusively uses **Bun** as its runtime and package manager. Node.js, npm, yarn, and pnpm are explicitly disabled via package.json engines configuration.

**Environment Manager**: Uses `mise` for runtime version management (configured in lefthook hooks)

### Essential Commands

```bash
# Install dependencies
bun install --frozen-lockfile

# Development & Testing
bun test                    # Run tests once
bun test:watch             # Run tests in watch mode  
bun test:coverage          # Run tests with coverage report
bun run type-check         # TypeScript type checking

# Building
bun run build:release      # Build for release (ESM + CJS)

# Code Quality
bun --bun biome format --write .     # Format code
bun --bun biome lint --write .       # Lint and auto-fix

# Committing (uses conventional commits)
bun run commit            # Interactive commit with commitizen

# Release (CI only)
bun run release          # Automated release with conventional changelog
```

### Running Single Tests

```bash
# Run specific test file
bun vitest test/plugin.test.ts

# Run tests matching pattern
bun vitest --grep "removes !important"

# Run in watch mode for specific file
bun vitest test/plugin.test.ts --watch
```

## Architecture Overview

This is a PostCSS plugin built with TypeScript that removes `!important` declarations from CSS. The architecture follows a clean separation of concerns:

### Core Structure

- **`src/plugin.ts`** - Main PostCSS plugin implementation with visitor pattern
- **`src/types.ts`** - TypeScript interfaces for plugin options and statistics
- **`src/utils.ts`** - Utility functions for pattern matching and data normalization
- **`src/index.ts`** - Public API exports

### Key Design Patterns

**PostCSS Visitor Pattern**: The plugin uses PostCSS's visitor hooks (`Declaration`, `Once`, `OnceExit`) to process CSS AST nodes.

**Performance Optimizations**: 
- Uses `Set` data structures for O(1) property lookups instead of arrays
- Implements selector pattern matching with RegExp support
- Tracks performance metrics in verbose mode

**Statistics & Reporting**:
- Collects removal statistics (total count, per-property, per-selector)
- Optional verbose logging with performance timing
- Inter-plugin communication via PostCSS messages

### Plugin Options Architecture

The plugin supports flexible configuration:
- `removeAll` (default: true) - Remove all or target specific properties
- `properties/exclude` - Arrays or Sets for property filtering
- `preserveSelectors` - Array of strings/RegExp patterns to preserve
- `verbose/reportChanges` - Debugging and integration options

## Testing Strategy

**Test Organization**:
- `test/plugin.test.ts` - Core functionality, options, edge cases, performance
- `test/integration.test.ts` - Integration with other PostCSS plugins

**Performance Testing**: 
- Tests process 10,000 CSS rules to ensure scalability
- Validates O(1) Set-based property lookups
- Includes timing assertions for CI reliability

**Coverage Requirements**:
- Branches: 90%+, Functions: 95%+, Lines: 95%+, Statements: 95%+

## Build & Release Process

**Build Configuration** (`tsup.config.ts`):
- Dual output: ESM (`.mjs`) and CommonJS (`.cjs`)
- TypeScript declaration files generated for ESM only
- External PostCSS dependency, Node.js 20+ target
- Tree-shaking and minification enabled

**Automated Release Flow**:
1. Pre-release: Type checking → Build → Clean publish preparation
2. Conventional changelog generation from commit messages
3. GitHub release creation with automated release notes
4. NPM publishing from `./dist` directory
5. Post-release cleanup of build artifacts

**Commit Message Format**: Uses Angular conventional commits with custom scopes: `workspace`, `config`, `plugin`

## Code Quality Standards

**Biome Configuration**: Comprehensive linting rules with 100+ enabled rules covering:
- Complexity reduction (no-forEach, use arrow functions)
- Correctness (proper TypeScript usage)  
- Performance (no accumulating spreads, avoid barrel files)
- Security (prevent dangerous patterns)

**TypeScript Configuration**: Strict mode enabled with additional strict options:
- `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- Node.js LTS + Bun-specific type configurations
- Declaration maps and source maps for debugging

**Git Hooks** (lefthook):
- Pre-commit: Format → Lint → Sort package.json → Format TOML
- Commit-msg: Commitlint validation
- Post-checkout/merge: Dependency installation

## Plugin Development Patterns

When extending this plugin:

1. **Add new options to `PostCSSNoImportantOptions` interface** in `types.ts`
2. **Implement option handling** in the plugin factory function
3. **Use visitor pattern** - prefer `Declaration` hook for CSS property processing
4. **Leverage utility functions** - `normalizeToSet()` for array/Set handling, `matchesPattern()` for selector matching
5. **Update statistics** - Maintain the `RemovalStats` structure for debugging
6. **Add comprehensive tests** - Cover new functionality, edge cases, and performance implications

The plugin is designed for high performance with large CSS files and provides extensive configuration options while maintaining backward compatibility.

## Debugging & Troubleshooting

### Verbose Mode
```bash
# Enable detailed logging with performance metrics
bun vitest test/plugin.test.ts --verbose
```

Plugin usage with verbose mode:
```js
postcss([plugin({ verbose: true, reportChanges: true })])
```

### Common Issues

**Performance Issues**: 
- Use `Set` instead of arrays for `properties`/`exclude` options
- Enable verbose mode to identify bottlenecks
- Consider using `preserveSelectors` instead of complex exclude logic

**Testing Issues**:
- Tests expect Bun runtime - don't run with Node.js
- Coverage thresholds are strict (90%+ branches, 95%+ functions/lines/statements)
- Performance tests may be flaky on slow CI - timing thresholds are generous

**Build Issues**:
- Ensure `bun --bun` prefix for build commands
- TypeScript declarations only generated for ESM build
- Clean publish requires `./dist` directory structure

### Development Workflow

1. **Feature Development**: `bun test:watch` for TDD
2. **Code Quality**: Pre-commit hooks auto-format and lint
3. **Performance**: Run performance tests before PR
4. **Release**: Only via CI with conventional commits
