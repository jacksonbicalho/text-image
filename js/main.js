
;(function( undefined ) {
  'use strict';

  require.config({

    baseUrl: './js',

    paths: {
      'jquery': 'vendor/jquery-3.1.1.min',
      'jquery-ui': 'vendor/jquery-ui-1.12.1/jquery-ui.min',
      'jquery.textImage': 'src/jquery.textImage',
      'text-image': 'src/text-image',
    },

    shim: {
      'jquery.textImage': {
        deps: [ 'jquery' ],
      },
    }

  });

  require(['text-image' ], function( $ ) {  });
})();
