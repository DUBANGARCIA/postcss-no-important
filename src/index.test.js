import postcss from 'postcss';
import plugin from './index';

async function run(input, output, options) {
  const result = await postcss([plugin(options)]).process(input, { from: undefined });
  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

describe('main', () => {
  test('delete !important', async () => {
    await run('a{background: #ffffff !important;}', 'a{background: #ffffff;}', {})
  });
});
