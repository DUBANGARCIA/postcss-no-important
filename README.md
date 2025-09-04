# PostCSS No Important

[![Build Status](https://github.com/DUBANGARCIA/postcss-no-important/actions/workflows/build.yml/badge.svg)](https://github.com/DUBANGARCIA/postcss-no-important/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/DUBANGARCIA/postcss-no-important/branch/main/graph/badge.svg)](https://codecov.io/gh/DUBANGARCIA/postcss-no-important)
[![Known Vulnerabilities](https://snyk.io/test/github/DUBANGARCIA/postcss-no-important/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DUBANGARCIA/postcss-no-important?targetFile=package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/postcss-no-important.svg)](https://badge.fury.io/js/postcss-no-important)

A powerful [PostCSS] plugin written in TypeScript that intelligently removes `!important` declarations from CSS, offering fine-grained control and performance optimizations.

[PostCSS]: https://github.com/postcss/postcss

## ✨ Features

- 🎯 **Selective Removal** - Remove all `!important` or target specific properties
- 🛡️ **Selector Preservation** - Preserve `!important` on specific selectors with RegExp support
- ⚡ **High Performance** - Optimized with Set-based lookups for large CSS files
- 📊 **Detailed Statistics** - Track removals with performance metrics and reporting
- 🔧 **Full TypeScript** - Complete type safety and IntelliSense support
- 🏗️ **Modern Architecture** - Built with PostCSS visitor pattern for efficiency
- 📈 **Inter-plugin Communication** - Emit messages for integration with other PostCSS plugins

## 📦 Installation

```bash
# Using npm
npm install --save-dev postcss postcss-no-important

# Using yarn
yarn add --dev postcss postcss-no-important

# Using pnpm
pnpm add --save-dev postcss postcss-no-important

# Using bun
bun add --dev postcss postcss-no-important
```

## 🚀 Usage
### Basic Usage

```js
const postcss = require('postcss');
const noImportant = require('postcss-no-important');

postcss([noImportant()])
.process(css, { from: 'input.css' })
.then(result => {
console.log(result.css);
});
```

**Input:**
```css
.foo {
  background-color: #ccc !important;
  color: red !important;
  margin: 10px !important;
}

.bar {
  font-size: 16px !important;
}
```

**Output:**

```css
.foo {
  background-color: #ccc;
  color: red;
  margin: 10px;
}

.bar {
  font-size: 16px;
}
```

### Advanced Configuration
#### Target Specific Properties

```js
postcss([
  noImportant({
    removeAll: false,
    properties: ['color', 'background-color'] // Only remove from these properties
  })
])
```

#### Exclude Specific Properties

```js
postcss([
  noImportant({
    removeAll: true,
    exclude: ['z-index', 'position'] // Remove from all except these
  })
])
```

#### Preserve Selectors with Pattern Matching

```js
postcss([
  noImportant({
    preserveSelectors: [
      '.utility-', // String matching
      /^\.u-/, // RegExp support
      /hover|focus|active/ // Complex patterns
    ]
  })
])
```

#### Performance Optimized with Sets

```js
postcss([
  noImportant({
    properties: new Set(['margin', 'padding']), // O(1) lookup performance
    exclude: new Set(['font-weight', 'z-index'])
  })
])
```

#### Verbose Logging and Statistics

```js
postcss([
  noImportant({
    verbose: true, // Enable detailed logging
    reportChanges: true // Emit messages for other plugins
  })
])
```

**Console Output:**

postcss-no-important - Removal Summary:
Total removed: 42
Processing time: 1.23ms

Top properties:
margin: 15
color: 12
background-color: 8
font-size: 4
padding: 3

## 🎛️ Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `removeAll` | `boolean` | `true` | Remove from all declarations `!important` |
| `properties` | `string[] | Set<string>` | `[]` | Target specific properties (when ) `removeAll: false` |
| `exclude` | `string[] | Set<string>` | `[]` | Exclude specific properties (when `removeAll: true`) |
| `preserveSelectors` | `(string | RegExp)[]` | `[]` | Preserve on matching selectors `!important` |
| `verbose` | `boolean` | `false` | Enable detailed logging with performance metrics |
| `reportChanges` | `boolean` | `false` | Emit PostCSS messages for plugin integration |


### TypeScript Support
Full TypeScript definitions are included:

```ts
import postcss from 'postcss';
import noImportant, { type PostCSSNoImportantOptions } from 'postcss-no-important';

const options: PostCSSNoImportantOptions = {
  removeAll: false,
  properties: new Set(['color', 'background-color']),
  preserveSelectors: [/^\.utility-/],
  verbose: true
};

const result = await postcss([noImportant(options)])
  .process(css, { from: 'input.css' });
```

## 🏗️ Integration Examples
### With Other PostCSS Plugins

```js
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const noImportant = require('postcss-no-important');

postcss([
  noImportant({ reportChanges: true }), // Run before other plugins
  autoprefixer()
])
.process(css)
.then(result => {
  // Access removal statistics
  const stats = result.messages.find(msg => msg.type === 'statistics');
  console.log(`Removed ${stats.stats.total} !important declarations`);
});
```

### Webpack Configuration

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-no-important', {
                    preserveSelectors: ['.critical-', /^\.override-/],
                    verbose: process.env.NODE_ENV === 'development'
                  }]
                ]
              }
            }
          }
        ]
      }
    ]
  }
};
```

### Vite Configuration

```js
import { defineConfig } from 'vite';
import noImportant from 'postcss-no-important';

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        noImportant({
          exclude: ['z-index'],
          verbose: true
        })
      ]
    }
  }
});
```

## 📊 Performance
The plugin is optimized for large CSS files:
- **Set-based lookups**: O(1) property matching instead of array scanning
- **Visitor pattern**: Efficient AST traversal with PostCSS
- **Memory efficient**: Minimal memory footprint during processing
- **Benchmarked**: Tested with 10,000+ CSS rules for performance validation

## 🔧 Development
The project uses modern development tools:
- **Bun** as runtime and package manager
- **TypeScript** for type safety
- **Vitest** for testing with 90%+ coverage
- **Biome** for linting and formatting
- **Conventional commits** with automated releases

### Building from Source

```bash
# Clone repository
git clone https://github.com/DUBANGARCIA/postcss-no-important.git
cd postcss-no-important

# Install dependencies (requires Bun)
bun install --frozen-lockfile

# Run tests
bun test

# Build the project
bun run build:release
```

## 📈 Migration from v10.x
The plugin has been completely rewritten in TypeScript with new features:

```js
// v10.x (deprecated)
postcss([noImportant()])

// v11.x (current) - same basic usage
postcss([noImportant()])

// v11.x (new features)
postcss([noImportant({
  preserveSelectors: [/^\.utility-/], // NEW: RegExp support
  verbose: true, // NEW: Performance metrics
  properties: new Set(['color']) // NEW: Set optimization
})])
```

## 🤝 Contributing
Contributions are welcome! Please read our contributing guidelines and ensure all tests pass:

```bash
# Run tests with coverage
bun test:coverage

# Lint and format
bun run format
bun run lint

# Commit with conventional format
bun run commit
```

## 📄 License
[MIT](LICENSE) © [Duban Garcia](https://github.com/DUBANGARCIA)
## 🙏 Acknowledgments
- Built with [PostCSS](https://postcss.org/)
- Inspired by the CSS community's need for better management `!important`
- Thanks to all contributors and users for feedback and improvements

