var postcss = require('postcss');

var plugin = require('./index.js');

function run(input, output, opts) {
    return postcss([ plugin(opts) ]).process(input)
        .then(function(result) {
            expect(result.css).toEqual(output);
            expect(result.warnings().length).toBe(0);
        });
}

/* Write tests here

it('does something', () => {
    return run('a{ }', 'a{ }', { });
});

*/

it('delete !important', function(){
    return run('a{background: #ffffff !important;}', 'a{background: #ffffff;}', {})
});
