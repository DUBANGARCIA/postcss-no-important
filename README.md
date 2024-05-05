# PostCSS No Important 
[![Build Status][ci-img]][ci] [![Known Vulnerabilities](https://snyk.io//test/github/DUBANGARCIA/postcss-no-important/badge.svg?targetFile=package.json)](https://snyk.io//test/github/DUBANGARCIA/postcss-no-important?targetFile=package.json)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


[PostCSS] plugin for delete declarations !important.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/DUBANGARCIA/postcss-no-important.svg
[ci]:      https://travis-ci.org/DUBANGARCIA/postcss-no-important

```css
.foo {
    /* Input example */
    
    background-color: #ccc !important;
}
```

```css
.foo {
  /* Output example */
  
  background-color: #ccc;
}
```

## Installation

```bash
pnpm add -D postcss postcss-no-important
```

## Usage

```js
postcss([ require('postcss-no-important') ])
```

See [PostCSS] docs for examples for your environment.
