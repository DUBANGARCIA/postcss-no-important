import postcss, { type Declaration, type PluginCreator } from 'postcss';
import plugin from 'postcss-no-important';
import { describe, expect, test } from 'vitest';

describe('Integration with other PostCSS plugins', () => {
  test('works in plugin chain', async () => {
    const testPlugin: PluginCreator<void> = () => ({
      postcssPlugin: 'test-plugin',
      Declaration(decl: Declaration) {
        if (decl.prop === 'test-prop') {
          decl.value = 'modified';
        }
      },
    });
    testPlugin.postcss = true;

    const result = await postcss([plugin({ removeAll: true }), testPlugin()]).process(
      'a { color: red !important; test-prop: original; }',
      { from: 'test.css' },
    );

    expect(result.css).toBe('a { color: red; test-prop: modified; }');
  });

  test('preserves source maps', async () => {
    const result = await postcss([plugin()]).process('a { color: red !important; }', {
      from: 'input.css',
      to: 'output.css',
      map: { inline: false },
    });

    expect(result.map).toBeDefined();
    expect(result.map?.toJSON().sources).toContain('input.css');
  });
});
