(function ( $ ) {

    $.fn.textImage = function( options ) {

        var parentElement = this;

        // Objeto para armazenar os dados de cada elemento inserido no quadro
        var metadata = metadata || {}

        //Veriáveis e métodos padrões
        var defaults = {

            deselectAllButton: "#deselect-all",

            inputTextClass: "input-text",

            layersElement: "#text-image-layers",

            divTextClass: "div-text",

            inputTextWidth: 250,

            inputTextHeight: 17,

            parentElementCallBacks: {
                dblclick: function( e ) {
                    var inputText = addInputText( e, this );

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

        /*
            Registra o maniupulador de eventos para o botão desselecionar
            tudo
        */
        $( settings.deselectAllButton ).on('click', function(){
            metadata.deselectAll();
        });

        function addInputText( e, o ){

            // Obtém a posição do clique no objeto parent ao clicado
            var parentOffset = $( o ).parent().offset();

            // Calcula a posição do clique no quadro
            var clickX = e.pageX - parentOffset.left;
            var clickY = e.pageY - parentOffset.top;

            // Impõe limites para a criação do input dentro do quadro
            if ( (clickX + settings.inputTextWidth) > $( o ).width() ) {
                clickX = settings.inputTextWidth-10
            }
            if(clickX < 10) clickX = 10;

            // Obtém uma string para ser usada como id e nome do elemento
            var textId = buildId();

            //Insere o input a criação do texto, atribuindo-o a variável
            inputAtivo = $('<input/>').attr({
                type: 'text',
                id: 'id_input_text_' + textId,
                class: settings.inputTextClass,
                name: 'input_text_' + textId,
            }).css({
                width: settings.inputTextWidth,
                height: settings.inputTextHeight,
                left: clickX,
                position: 'absolute',
                top: clickY
            }).appendTo( o ).focus();

            return inputAtivo;
        }

        // Converte um input text em uma div
        function inputToDiv( input ){

            if(input != null){

                if (( input ).val() !="") {

                    // Insere uma div
                    var div = $('<div/>').attr({
                        id: input.attr("id").replace("input", "div"),
                        class: 'layer ' + settings.divTextClass,
                        name: input.attr("name").replace("input", "div")
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

                    $(input).remove();

                    metadata.addText( div );
                    console.log( metadata.data );
                }
            }

            return false;
        }

        var elementos = parentElement.children();
        elementos.each(function(e){
            $(this).resizable();
            // $(this).draggable( {containment: "parent"} );
        });

        // Retorna uma string para ser usada como ID dos elementos
        function buildId(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 8; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        // Objeto que trata os dados contidos no quadro
        metadata = {

            // Armazenagem de fato dos elementos, coma variável selected, que
            // registra o elemento selecionado
            data: { selected: [] },

            // Insere um novo texto no contexto
            addText: function( text ){

                if ( !( text.attr("id") in this.data ) ) {

                    // Remove as classes ui-draggable ui-draggable-handle ui-resizable
                    // pois serão inseridas novamente
                    text.removeClass("ui-draggable ui-draggable-handle ui-resizable");

                    this.data[ text.attr("id") ] = {

                        attrs: {
                            id: text.attr("id"),
                            class: text.attr("class"),
                            name: text.attr("name")
                        },

                        css: {
                            width: text.width(),
                            height: text.height(),
                            left: text.position().left,
                            position: "absolute",
                            top: text.position().top,
                            display: 'table'
                        },

                        text: text.text()
                    }

                    // Insere o item no menu ( layersElement )
                    $( settings.layersElement ).append(
                        $('<li/>', {
                            'id': text.attr("id").replace("div", "li"),
                            'data-role': "list-divider"
                        }).append(
                            $('<a/>', {
                                'href': '#',
                                'data-transition': 'slide',
                                'text': text.text()
                            })
                        ).on("click", function(){
                            metadata.selectText( $(this).attr( "id" ) )
                        })
                    );

                    // Registra
                    text.on("mousedown", function(){
                        metadata.selectText( $(this).attr( "id" ) )
                    })

                    this.selectText( text.attr( "id" ) );
                }
            },

            // Seleciona um texto existente no contexto
            selectText: function( textId ){

                var id = textId.split("_").pop(-1);

                // Desseleciona qualquer outro que esteja selecionado
                this.deselectAll();

                this.data.selected.push(id);

                // Marca em ( layersElement ) o ítem selecionado
                $( "#id_li_text_" + id )
                .addClass( "selected" );

                // Marca no quadro o elemento selecionado
                $( "#id_div_text_" + id ).addClass( "selected" );
            },

            // desseleciona uma layer específica
            deselect: function(id){

                // no menu...
                $( "#id_li_text_" + id )
                .removeClass( "selected" );

                // no quadro...
                $( "#id_div_text_"+ id )
                .removeClass( "selected" );

                metadata.data.selected = $.grep(metadata.data.selected, function(val, index) {
                    return val == id;
                })

            },

            // Desmarca todos os elementos que estejam marcados
            deselectAll:  function(){

               for (var i in metadata.data.selected) {
                    this.deselect( metadata.data.selected[i] );
                }
            }

        }
    };

}( jQuery ));
