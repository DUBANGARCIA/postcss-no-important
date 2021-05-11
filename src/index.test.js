import postcss from 'postcss';
import plugin from './index';

const run = (input, output, options) =>
  postcss([plugin(options)])
    .process(input)
    .then((result) => {
      expect(result.css).toEqual(output);
      expect(result.warnings()).toHaveLength(0);
    });

describe('main', () => {
  test('delete !important', () =>
    run('a{background: #ffffff !important;}', 'a{background: #ffffff;}', {}));
});
