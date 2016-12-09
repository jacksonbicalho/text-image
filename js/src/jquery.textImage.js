/*
Registrando alguns padrões estabelecidos:

1 - Sobre os atributos nomeados dinâmicamente

1.1 - de inputs

    id:
        O [ id ] atribuído ao input recebe a string  [ "id_input_text_" ]
        concatenada com um identificador que na verdade será a
        identificação de cada layer.

        Exemplo:
            id: "id_input_text_" +  buildId()
            = "id_input_text_opjLWpZF"

    class:
        O atributo [ class ] rebebe a string [ "input_text " ] concatenada
        com  [ settings.inputTextClass ].

        Exemplo:
            class: "input_text " + settings.inputTextClass
            = "input_text classe1 classeN"

    name:
        O atributo [ name ] recebe a string [ "input_" ] concatenada com o
        mesmo identicador usado na formação do [ id ]

        Exemplo:
            name: "input_" + buildId()
            = "input_text_opjLWpZF"


1.1 - de layers
    As layers são o que envolve qualquer quanquer coisa dentro do quadro,
    uma div.

    id:
        O atributo [ id ] de uma layer é formado pelo id do [ input ]
        responsável pela criação da layer, sendo o nome [ input ] substituído
        pelo nome layer.

        Exemplo:
            id: input.attr("id").replace("input", "layer")
            = "id_layer_text_opjLWpZF"

    class:
        O atributo [ class ] rebebe a string [ "layer_text " ] concatenada
        com [ settings.layerTextClass ].

        Exemplo:
            class: "layer_text " + settings.layerTextClass
            = "layer_text classe5 classe10"

    name:
        O atributo [ name ] recebe a string [ "layer_" ] concatenada com o
        mesmo identicador usado na formação do [ id ].
        O mesmo que usar o mesmo nome do input substituindo o nome [ input ]
        pelo nome [ layer ].

        Exemplo:
            name: input.attr("name").replace("input", "layer")
            = "layer_text_opjLWpZF"
 */

(function ( $ ) {

    $.fn.textImage = function( options ) {

        var parentElement = this;

        // Objeto para armazenar os dados de cada elemento inserido no quadro
        // Ele além de armazenar todos os objetos inseridos no quadro, ele
        // também manipula estes dados e gerencia a lista de exibição das layers
        // no quadro
        var metadata = metadata || {}

        var inputText = inputText || {}

        var layerText = layerText || {}

        // Veriáveis e métodos padrões
        var defaults = {

            deselectAllButton: "#deselect-all",

            layerPanelBtnDelete: "#btn-delete",

            inputTextClass: "input-text",

            layerTextClass: "div-text",

            layersElement: "#text-image-layers",


            inputTextWidth: 250,

            inputTextHeight: 17,

            // Registra os callbacks possíveis de serem reescritos na
            // configuração.
            parentElementCallBacks: {

                dblclick: function( e ) {

                    // Insere no quadro um input text para inserção de texto
                    inputText.make( e, this );
                }
            },

            backgroundColor: 'trasparent'
        }

        // Mescla as configuração passadas com as definidas por padrão
        var settings = $.extend({}, $.extend(defaults, options ) );

        // Define propriedades css para o objeto usado
        this.css({
            backgroundColor: settings.backgroundColor
        });

        applyParentElementCallBacks();
        function applyParentElementCallBacks(){
            // Registra todos os manipuladores passados em parentElementCallBacks
            var aPeCb = settings.parentElementCallBacks;
            for (key in aPeCb) {
                parentElement.on( key, aPeCb[key] ) ;
            }
        }

        // Registra o manipulador de eventos para o botão
        // desselecionar tudo [ TESTE ] !
        $( settings.deselectAllButton ).on('click', function(){
            metadata.deselectAll();
        });

        // Registra o manipulador de eventos para o botão Delete
        // (layerPanelBtnDelete)
        $( settings.layerPanelBtnDelete ).on('click', function(){

            // Verificar se há algo selecionado
            metadata.removeItem( metadata.data.selected );
        });

        // O input exibido no quadro para inserções de textos
        inputText = {

            // Cria no quadro um input para inserção de textos
            make: function(e, o){

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

                if(clickY < 10) clickY = 10;

                // Obtém uma string para ser usada como id e nome do elemento
                var textId = buildId();

                var attr = {
                    type: 'text',
                    id: 'id_input_text_' + textId,
                    class: settings.inputTextClass,
                    name: 'input_text_' + textId,
                };

                var css = {
                    width: settings.inputTextWidth,
                    height: settings.inputTextHeight,
                    left: clickX,
                    position: 'absolute',
                    top: clickY
                }

                // Insere o input a criação do texto, atribuindo-o a variável
                inputAtivo = this._build( attr, css );

                inputAtivo.on( "keypress", function(e) {
                    if(e.which == 13) {
                        layerText.make( this );
                    }
                });

                inputAtivo.on(" blur", function(){
                    layerText.make( this );
                });

                inputAtivo.appendTo( o ).focus();

                return this;
            },

            _build: function( attr, css ){

                attr = attr || {};
                css = css || {};

                // Insere o input a criação do texto, atribuindo-o a variável
                inputAtivo = $('<input/>').attr(attr).css(css)

                return inputAtivo;
            }
        }

        layerText = {

            make: function( input ){

                if(input != null){

                    if ( ( $(input) ).val() != "" ) {

                        // Cria a div para o conteúdo
                        var layerContent = $('<div/>').attr({
                            class: 'layerContent',
                        }).text( $(input).val() )

                        // Insere uma div
                        var layer = $('<div/>').attr({
                            id: $(input).attr("id").replace("input", "layer"),
                            class: 'layer ' + settings.layerTextClass
                        }).css({
                            width: $(input).width(),
                            height: $(input).height(),
                            left: $(input).position().left,
                            position: 'absolute',
                            top: $(input).position().top,
                            display: 'table'
                        })
                        .draggable( {containment: "parent"} )
                        .resizable()
                        .appendTo( parentElement );

                        layerContent.appendTo( layer );

                        $(input).remove();

                        // Registra dblclick para a layer, para edição
                        layer.on("dblclick", function(){
                            $( parentElement ).off( 'dblclick' );
                            layerText.edit( layer );
                        });

                        metadata.addItem( layer );
                        return layer;
                    }
                }

                $(input).remove();
                return false;
            },

            edit: function( layer ){

                var attr = {
                    type: 'text',
                    id: layer.attr( "id" ).replace("layer", "input"),
                    class: settings.inputTextClass,
                    name: layer.attr( "id" ).replace( "id_layer_text", "layer_text" ),
                };

                var css = {
                    width: settings.inputTextWidth,
                    height: settings.inputTextHeight,
                    left: layer.position().left,
                    position: 'absolute',
                    top: layer.position().top
                }

                // Insere o input a criação do texto, atribuindo-o a variável
                inputAtivo = inputText._build( attr, css );

                layer.hide();

                inputAtivo.val( layer.children( ".layerContent" ).text() );

                // Se digitar enter
                inputAtivo.on("keypress", function(e) {
                    if(e.which == 13) {
                        returnLayer();
                    }
                });

                inputAtivo.on("blur", function(){
                    returnLayer();
                });

                inputAtivo.appendTo( parentElement ).focus();

                // Chamada quando retorna da edição para a layer
                var returnLayer = function(){

                    // Se o input estiver vazio exclui a layer
                    if ( inputAtivo.val() == "" ) {
                        metadata.removeItem( metadata.data.selected );
                    }

                    layer.children( ".layerContent" ).text( inputAtivo.val() );
                    layer.show();
                    metadata.editItem( layer )
                    inputAtivo.remove();
                }
            }
        }

        // Objeto que trata os dados contidos no quadro
        metadata = {

            // Armazenagem de fato dos elementos, coma variável selected, que
            // registra o elemento selecionado
            data: { selected: [] },

            // Insere um novo texto no contexto
            addItem: function( text ){

                if ( !( text.attr("id") in this.data ) ) {

                    // Remove as classes ui-draggable ui-draggable-handle ui-resizable
                    // pois serão inseridas novamente
                    text.removeClass("ui-draggable ui-draggable-handle ui-resizable");

                    this.data[ text.attr("id").replace("id_div_text_", "") ] = {

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
                }

                this.addMenuItem( text );
            },

            addMenuItem: function( text ){

                // Insere o item no menu ( layersElement )
                $( settings.layersElement ).append(
                    $('<li/>', {
                        'id': text.attr("id").replace("layer", "li"),
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
            },

            // Edita um item em metadata.data
            editItem( layer ){
                this.data[ layer.attr("id") ] = layer;
                this.editMenuItem( layer );
            },

            // Edita um item das lista no menu de layers
            editMenuItem( layer ){
                $("#" + layer.attr("id").replace("layer", "li"))
                .text( layer.text() );

                // Registra novamente os callBacks no quadro
                applyParentElementCallBacks();
            },

            // Remove  um item específico de metadata.data
            removeItem: function( itens ){

                data = { selected: [] }

                data.selected = metadata.data.selected;

                itens.forEach( function(item){

                    $.each(metadata.data, function(i){

                        if ( i != 'selected' ) {
                            if ( i != item ) {
                                data[ item ] = metadata.data[ item ];
                            }
                        }
                    });
                    $( "#id_div_text_" + item ).remove();
                    metadata.removeMenuItem( item );
                })

                metadata.data = data;
            },

            removeMenuItem: function( id ){
                $( "#id_li_text_" + id ).remove();
                $( "#id_layer_text_" + id ).remove();
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
                $( "#id_layer_text_" + id ).addClass( "selected" );
            },

            // desseleciona uma layer específica
            deselect: function(id){

                // no menu...
                $( "#id_li_text_" + id )
                .removeClass( "selected" );

                // no quadro...
                $( "#id_layer_text_"+ id )
                .removeClass( "selected" );

                metadata.data.selected = []

            },

            // Desmarca todos os elementos que estejam marcados
            deselectAll:  function(){

                for (var i = metadata.data.selected.length - 1; i >= 0; i--) {
                    metadata.deselect( metadata.data.selected[i] );
                }

                return true;
            }
        }

        // var elementos = parentElement.children();
        // elementos.each(function(e){
        //     $(this).resizable();
        //     // $(this).draggable( {containment: "parent"} );
        // });

        // Retorna uma string para ser usada como ID dos elementos
        function buildId(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 8; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    };

}( jQuery ));
