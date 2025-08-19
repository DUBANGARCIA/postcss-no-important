export function normalizeToSet<T>(input: T[] | Set<T>): Set<T> {
  return input instanceof Set ? input : new Set(input);
}

export function matchesPattern(value: string, patterns: (string | RegExp)[]): boolean {
  return patterns.some((pattern) =>
    pattern instanceof RegExp ? pattern.test(value) : value.includes(pattern),
  );
}
