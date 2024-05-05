import postcss from 'postcss';
import { describe, expect, test } from '@jest/globals';
import plugin from '../src';

describe('main', () => {
  test('delete !important', async () => {
    const input = 'a{background: #ffffff !important;}';
    const output = 'a{background: #ffffff;}';
    const options = {};
    const result = await postcss([plugin(options)]).process(input, {
      from: undefined,
    });
    expect(result.css).toEqual(output);
    expect(result.warnings()).toHaveLength(0);
  });
});
