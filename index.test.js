const postcss = require('postcss');
const plugin = require('./index.js');

describe('main', () => {
  function run( input, output, opts ) {
    return postcss( [ plugin( opts ) ] )
      .process( input )
      .then( function ( result ) {
        expect( result.css ).toEqual( output );
        expect( result.warnings().length ).toBe( 0 );
      });
  }

  test('delete !important', function () {
    return run( 'a{background: #ffffff !important;}',
                'a{background: #ffffff;}', {} );
  });
});
