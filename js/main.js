
;(function( undefined ) {
  'use strict';

  require.config({
    baseUrl: './js',
    paths: {
      jquery: [
        'vendor/jquery-3.1.1.min'
      ],
      text-image: 'src/text-image',
    }
  });

  require([ 'text-image' ], function( $, _ ) {  });
})();
