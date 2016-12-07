
;(function( undefined ) {
  'use strict';

    require([ 'jquery', 'jquery-ui', 'jquery.textImage'], function( $ ) {

        var parentElement = $("#text-image").textImage({
            language: 'pt_BR',
            backgroundColor: "#ECACEC",
            panelTheme: "bootstrap",
            panelBtnSaveCallBacks: {
                beforeSave: "default",
                save: "default",
                afterSave: 'default'
            },
        });

        QUnit.test( "hello test", function( assert ) {
            parentElement.trigger( "dblclick" );
            assert.ok( 1 === 1, "Passed!" );
        });


    });
})();
