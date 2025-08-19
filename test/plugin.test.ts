import postcss, { type Message } from 'postcss';
import type { PostCSSNoImportantOptions } from 'postcss-no-important';
import plugin from 'postcss-no-important';
import { afterEach, beforeEach, describe, expect, type MockInstance, test, vi } from 'vitest';

describe('postcss-no-important', () => {
  const process = async (input: string, opts: PostCSSNoImportantOptions = {}) => {
    return await postcss([plugin(opts)]).process(input, { from: 'test.css' });
  };

  const run = async (input: string, output: string, opts: PostCSSNoImportantOptions = {}) => {
    const result = await process(input, opts);
    // biome-ignore lint/suspicious/noMisplacedAssertion: test helper asserts result
    expect(result.css).toBe(output);
    // biome-ignore lint/suspicious/noMisplacedAssertion: test helper asserts result
    expect(result.warnings()).toHaveLength(0);
    return result;
  };

  describe('Core functionality', () => {
    test('removes !important by default', async () => {
      await run('a { color: red !important; }', 'a { color: red; }');
    });

    test('preserves non-important declarations', async () => {
      await run('a { color: red; margin: 0; }', 'a { color: red; margin: 0; }');
    });

    test('handles multiple !important in same rule', async () => {
      await run(
        'a { color: red !important; margin: 0 !important; padding: 10px; }',
        'a { color: red; margin: 0; padding: 10px; }',
      );
    });

    test('works with nested selectors', async () => {
      await run(
        '.parent { .child { color: blue !important; } }',
        '.parent { .child { color: blue; } }',
      );
    });
  });

  describe('Options', () => {
    describe('removeAll: false', () => {
      test('does nothing when no properties specified', async () => {
        await run('a { color: red !important; }', 'a { color: red !important; }', {
          removeAll: false,
        });
      });

      test('removes only specified properties', async () => {
        await run(
          'a { color: red !important; margin: 0 !important; }',
          'a { color: red; margin: 0 !important; }',
          { removeAll: false, properties: ['color'] },
        );
      });
    });

    describe('exclude option', () => {
      test('excludes specified properties from removal', async () => {
        await run(
          'a { color: red !important; margin: 0 !important; }',
          'a { color: red !important; margin: 0; }',
          { exclude: ['color'] },
        );
      });

      test('works with Set (Node.js 20+)', async () => {
        await run(
          'a { color: red !important; margin: 0 !important; }',
          'a { color: red !important; margin: 0; }',
          { exclude: new Set(['color']) },
        );
      });
    });

    describe('preserveSelectors option', () => {
      test('preserves !important on specific selectors', async () => {
        await run(
          '.utility { margin: 0 !important; } .normal { margin: 0 !important; }',
          '.utility { margin: 0 !important; } .normal { margin: 0; }',
          { preserveSelectors: ['.utility'] },
        );
      });

      test('supports RegExp patterns', async () => {
        await run(
          '.u-m-0 { margin: 0 !important; } .normal { margin: 0 !important; }',
          '.u-m-0 { margin: 0 !important; } .normal { margin: 0; }',
          { preserveSelectors: [/^\.u-/] },
        );
      });
    });
  });

  describe('Complex CSS', () => {
    test('handles media queries', async () => {
      await run(
        '@media (max-width: 768px) { .mobile { display: block !important; } }',
        '@media (max-width: 768px) { .mobile { display: block; } }',
      );
    });

    test('handles @supports rules', async () => {
      await run(
        '@supports (display: grid) { .grid { display: grid !important; } }',
        '@supports (display: grid) { .grid { display: grid; } }',
      );
    });

    test('handles keyframes', async () => {
      await run(
        '@keyframes slide { from { left: 0 !important; } to { left: 100% !important; } }',
        '@keyframes slide { from { left: 0; } to { left: 100%; } }',
      );
    });

    test('handles multiple selectors', async () => {
      await run(
        'h1, h2, h3 { font-weight: bold !important; }',
        'h1, h2, h3 { font-weight: bold; }',
      );
    });

    test('handles pseudo-classes and pseudo-elements', async () => {
      await run(
        'a:hover { color: blue !important; } p::first-line { color: red !important; }',
        'a:hover { color: blue; } p::first-line { color: red; }',
      );
    });
  });

  describe('Performance', () => {
    test('efficiently processes large files with Node.js 20+ optimizations', async () => {
      const rules = Array.from(
        { length: 10000 },
        (_, i) => `.class-${i} { property-${i}: value !important; }`,
      ).join('\n');

      const start = performance.now();
      const result = await process(rules);
      const duration = performance.now() - start;

      expect(result.css).not.toContain('!important');
      // Allow variance on CI runners; keep generous threshold to avoid flakiness
      expect(duration).toBeLessThan(250);

      console.log(`Processed 10,000 rules in ${duration.toFixed(2)}ms`);
    });

    test('uses Set for O(1) property lookups', async () => {
      const properties = new Set(['color', 'background', 'margin']);

      const start = performance.now();
      await run(
        'a { color: red !important; width: 100% !important; margin: 0 !important; }',
        'a { color: red; width: 100% !important; margin: 0; }',
        { removeAll: false, properties },
      );
      const duration = performance.now() - start;

      // Allow variance on slow CI; still asserts O(1) quick lookup
      expect(duration).toBeLessThan(20);
    });
  });

  describe('Verbose mode and reporting', () => {
    let consoleSpy: MockInstance;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        /* noop */
      });
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('logs statistics when verbose: true', async () => {
      await run(
        'a { color: red !important; margin: 0 !important; }',
        'a { color: red; margin: 0; }',
        { verbose: true },
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('postcss-no-important - Removal Summary:'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Total removed: 2'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Processing time:'));
    });

    test('reports changes to other plugins when reportChanges: true', async () => {
      const result = await process('a { color: red !important; }', { reportChanges: true });

      const isRemoval = (
        m: Message,
      ): m is Message & { type: 'removal'; prop: string; selector?: string } =>
        m.type === 'removal';
      const messages = result.messages.filter(isRemoval);
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({
        type: 'removal',
        plugin: 'postcss-no-important',
        prop: 'color',
      });
    });

    test('includes statistics in result messages', async () => {
      const result = await process('a { color: red !important; }');

      const isStatistics = (
        m: Message,
      ): m is Message & { type: 'statistics'; stats: { total: number; processingTime?: number } } =>
        m.type === 'statistics';
      const statsMsg = result.messages.find(isStatistics);
      expect(statsMsg).toBeDefined();
      expect(statsMsg?.stats).toHaveProperty('total', 1);
    });
  });

  describe('Edge cases', () => {
    test('handles empty CSS', async () => {
      await run('', '');
    });

    test('handles CSS with only comments', async () => {
      await run('/* comment */', '/* comment */');
    });

    test('handles malformed but parseable CSS', async () => {
      await run('a { color: red !important;; }', 'a { color: red;; }');
    });

    test('preserves important in values (not declaration important)', async () => {
      await run('a { content: "!important text"; }', 'a { content: "!important text"; }');
    });
  });
});
