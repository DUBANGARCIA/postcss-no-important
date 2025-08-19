import type { Declaration, Message, PluginCreator } from 'postcss';
import type { PostCSSNoImportantOptions, RemovalStats } from './types';
import { matchesPattern, normalizeToSet } from './utils';

const PLUGIN_NAME = 'postcss-no-important' as const;

const plugin: PluginCreator<PostCSSNoImportantOptions> = (options = {}) => {
  const {
    removeAll = true,
    properties = [],
    exclude = [],
    preserveSelectors = [],
    verbose = false,
    reportChanges = false,
  } = options;

  const propertiesSet = normalizeToSet(properties);
  const excludeSet = normalizeToSet(exclude);

  const stats: RemovalStats = {
    total: 0,
    properties: new Map(),
    selectors: new Map(),
  };

  let startTime = 0;

  return {
    postcssPlugin: PLUGIN_NAME,

    Once() {
      if (verbose) {
        startTime = performance.now();
      }
    },

    Declaration(decl: Declaration, { result }) {
      if (!decl.important) return;

      const parent = decl.parent;
      if (parent && 'selector' in parent) {
        if (matchesPattern(parent.selector, preserveSelectors)) {
          return;
        }
      }

      const shouldRemove = removeAll ? !excludeSet.has(decl.prop) : propertiesSet.has(decl.prop);

      if (shouldRemove) {
        decl.important = false;

        stats.total++;
        stats.properties.set(decl.prop, (stats.properties.get(decl.prop) ?? 0) + 1);

        if (parent && 'selector' in parent) {
          const sel = parent.selector;
          stats.selectors.set(sel, (stats.selectors.get(sel) ?? 0) + 1);
        }

        if (reportChanges) {
          const removalMessage: Message & { type: 'removal'; prop: string; selector?: string } = {
            type: 'removal',
            plugin: PLUGIN_NAME,
            prop: decl.prop,
          };
          if (parent && 'selector' in parent) {
            removalMessage.selector = parent.selector;
          }
          result.messages.push(removalMessage);
        }
      }
    },

    OnceExit(_, { result }) {
      if (verbose && stats.total > 0) {
        stats.processingTime = performance.now() - startTime;

        console.log(`\n${PLUGIN_NAME} - Removal Summary:`);
        console.log(`Total removed: ${stats.total}`);
        console.log(`Processing time: ${stats.processingTime.toFixed(2)}ms`);

        if (stats.properties.size > 0) {
          console.log('\nTop properties:');
          const top = Array.from(stats.properties.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
          for (const [prop, count] of top) {
            console.log(`  ${prop}: ${count}`);
          }
        }
      }

      {
        const statsPayload: { total: number; processingTime?: number } = { total: stats.total };
        if (stats.processingTime !== undefined) {
          statsPayload.processingTime = stats.processingTime;
        }
        const statsMessage: Message & {
          type: 'statistics';
          stats: { total: number; processingTime?: number };
        } = {
          type: 'statistics',
          plugin: PLUGIN_NAME,
          stats: statsPayload,
        };
        result.messages.push(statsMessage);
      }
    },
  };
};

plugin.postcss = true;
export default plugin;
