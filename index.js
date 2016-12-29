var postcss = require('postcss');

module.exports = postcss.plugin('postcss-no-important', function (opts) {
    opts = opts || {};

    // Work with options here

    return function (root) {

        // Transform CSS AST here

        root.walkDecls(function(decl) {
            // Transform each property declaration here

            var value = decl.important;

            if ( value ) {

                decl.important = false;
            }

        });

    };
});
