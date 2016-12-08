
;(function( undefined ) {
  'use strict';

    require([ 'jquery', 'jquery-ui', 'jquery.textImage'], function( $ ) {

        var options = {
            language: 'pt_BR',
            backgroundColor: "#ECACEC",
            panelTheme: "bootstrap",
            panelBtnSaveCallBacks: {
                beforeSave: "default",
                save: "default",
                afterSave: 'default'
            },
            inputTextClass: "input-text-class-test",
            divTextClass: "div-text-class-test"
        };

        $("#text-image").textImage( options );

        // QUnit.test( "Teste do quadro principal", function( assert ) {

        //     //  Dois cliques sobre o quadro
        //     $("#text-image").trigger( "dblclick" );

        //     // Pega o id do elemento criado
        //     $( "."+options.inputTextClass ).each(function(){

        //         var inputText = $(this);

        //         // Escreve no input
        //         inputText.val("String para teste!!!");

        //         // Testa se o conteúdo da div criada é definido anteriormente
        //         assert.ok( inputText.val() == "String para teste!!!", "Texto definido!")

        //         // Pressiona a tecla enter
        //         var e = jQuery.Event("keypress");
        //         e.which = 13;
        //         inputText.trigger(e);

        //         //  Pega a div criada
        //         $("."+options.divTextClass).each(function(){
        //             var divText = $( this );

        //             // Testa se o input criado foi removido do ambinete
        //             assert.ok( ($("#"+inputText.attr("id") ).val() == undefined) , "input text Removido!" );

        //         });


        //     });

        // });

    });
})();
