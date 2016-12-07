
;(function( undefined ) {
  'use strict';

  require.config({

    baseUrl: './js',

    paths: {

      'test-parent-element': 'src/tests/parent-element',
      // 'QUnit': 'src/tests/vendor/qunit-git',

      'jquery': 'vendor/jquery-3.1.1.min',
      'jquery-ui': 'vendor/jquery-ui-1.12.1/jquery-ui.min',
      'jquery.textImage': 'src/jquery.textImage',
      'text-image': 'src/text-image',
    },

    shim: {
      'jquery.textImage': {
        deps: [ 'jquery' ],
        // exports: 'jQuery.fn.textImage'
      },
      // 'test': {
      //   deps: [ 'QUnit' ],
      //   // exports: 'jQuery.fn.textImage'
      // },
    }

  });

  if (window.location.href.split(".")[0].split("/").pop(-1) === 'test') {
    require(['test-parent-element' ], function( $ ) {  });
  }else{
    require(['text-image' ], function( $ ) {  });
  }

})();
