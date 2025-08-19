export interface PostCSSNoImportantOptions {
  /**
   * Remove !important from all declarations
   * @default true
   */
  removeAll?: boolean;

  /**
   * Target specific properties (Set for O(1) lookup in Node.js 20+)
   * @default new Set()
   */
  properties?: string[] | Set<string>;

  /**
   * Exclude specific properties (Set for O(1) lookup in Node.js 20+)
   * @default new Set()
   */
  exclude?: string[] | Set<string>;

  /**
   * Preserve !important on specific selectors (supports RegExp patterns)
   * @default []
   */
  preserveSelectors?: (string | RegExp)[];

  /**
   * Enable verbose logging with performance metrics
   * @default false
   */
  verbose?: boolean;

  /**
   * Report changes for other PostCSS plugins
   * @default false
   */
  reportChanges?: boolean;
}

export interface RemovalStats {
  total: number;
  properties: Map<string, number>;
  selectors: Map<string, number>;
  processingTime?: number;
}
