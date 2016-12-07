(function ( $ ) {

    $.fn.textImage = function( options ) {

        var data = {};

        //Veriáveis e métodos padrões
        var defaults = {

            widthInputText: 250,

            heightInputText: 17,

            parentElementCallBacks: {
                dblclick: function( e ) {
                    var inputText = addInputText( e, this );
                    var parent = this;
                    inputText.keypress(function(e) {
                        if(e.which == 13) {
                            inputToDiv( inputText )
                        }
                    });
                }
            },

            backgroundColor: 'trasparent'
        }

        var settings = $.extend({}, $.extend(defaults, options ) );

        // Define propriedades css para o objeto usado
        this.css({
            backgroundColor: settings.backgroundColor
        });

        var aPeCb = settings.parentElementCallBacks;
        for (key in aPeCb) {
            this.on( key, aPeCb[key] ) ;
        }

        function addInputText( e, o ){

            // Obtém a posição do clique no objeto parent ao clicado
            var parentOffset = $( o ).parent().offset();

            // Calcula a posição do clique no quadro
            var clickX = e.pageX - parentOffset.left;
            var clickY = e.pageY - parentOffset.top;

            // Impõe limites para a criação do input dentro do quadro
            if ( (clickX + settings.widthInputText) > $( o ).width() ) {
                clickX = settings.widthInputText-10
            }
            if(clickX < 10) clickX = 10;

            // Obtém uma string para ser usada como id e nome do elemento
            var textId = buildId();

            //Insere o input a criação do texto, atribuindo-o a variável
            inputAtivo = $('<input/>').attr({
                type: 'text',
                id: 'id_input_text_' + textId,
                name: 'input_text_' + textId,
            }).css({
                width: settings.widthInputText,
                height: settings.heightInputText,
                left: clickX,
                position: 'absolute',
                top: clickY
            }).appendTo( o ).focus();

            return inputAtivo;
        }

        function inputToDiv( input ){

            if(input != null){

                // var textId = $(inputAtivo).attr("id");
                // var name = $(inputAtivo).attr("name");
                // var width = $(inputAtivo).width();
                // var height = $(inputAtivo).height();
                // var left = $(inputAtivo).position().left;
                // var top = $(inputAtivo).position().top;
                // var content = $(inputAtivo).val();

                // $(inputAtivo).remove();


                if (( input ).val() !="") {
                    // Insere uma div
                    var div = $('<div/>').attr({
                        id: input.attr("id"),
                        name: input.attr("name")
                    }).css({
                        width: input.width(),
                        height: input.height(),
                        left: input.position().left,
                        position: 'absolute',
                        top: input.position().top,
                        display: 'table'
                    }).text( input.val() )
                    .draggable( {containment: "parent"} )
                    .resizable()
                    .appendTo( input.parent() );
                    console.log( "Qua 07 Dez 2016 00:59:11 BRST" );
                }

            }

        }

        // Retorna uma string para ser usada como ID dos elementos
        function buildId(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

    };

}( jQuery ));
