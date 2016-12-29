var postcss = require('postcss');

module.exports = postcss.plugin('postcss-no-important', function () {

    return function (root) {

        // Transform CSS AST here

        root.walkDecls( function ( decl ) {
            // Transform each property declaration here

            var value = decl.important;

            if ( value ) {

                decl.important = false;
            }

        } );

    };
} );
