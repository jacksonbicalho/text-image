
(function ( $ ) {

    $.fn.textImage = function( options ) {

        var parentElement = this;

        var data = data || {}

        var inputLayer = inputLayer || {}

        var layer = layer || {}

        // Veriáveis e métodos padrões
        var defaults = {

            layerClass: "div-text",

            layerPanelBtnDeselectAll: "#deselect-all",

            layerPanelBtnDelete: "#btn-delete",

            textImagePanelElementLayerList: "#text-image-layers",

            inputLayerClass: "input-text",

            inputLayerWidth: 250,

            inputLayerHeight: 17,

            // Registra os callbacks possíveis de serem reescritos na
            // configuração.
            parentElementCallBacks: {

                dblclick: function( e ) {

                    // Insere no quadro um input text para inserção de texto
                    inputLayer.make( e, this );
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

            $.each( data.selected , function( k, v ) {
                data.remove( v );
            });

        });

        // O input exibido no quadro para inserções de textos
        inputLayer = {

            // Cria no quadro um input para inserção de textos
            make: function( event ){

                var parentOffset = parentElement.parent().offset();

                var clickX = event.pageX - parentOffset.left;
                var clickY = event.pageY - parentOffset.top;

                if ( (clickX + settings.inputLayerWidth) > parentElement.width() ) {
                    clickX = settings.inputLayerWidth-10
                }
                if(clickX < 10) clickX = 10;

                if(clickY < 10) clickX = 10;

                var textId = this.buildId();

                var attr = {
                    type: 'text',
                    id: 'id_input_text_' + textId,
                    class: settings.inputLayerClass,
                    name: 'input_text_' + textId,
                };

                var css = {
                    width: settings.inputLayerWidth,
                    left: clickX,
                    position: 'absolute',
                    top: clickY
                }

                inputAtivo = this._build( attr, css );

                inputAtivo.on( "keypress", function(e) {
                    if(e.which == 13) {
                        layer.make( this );
                    }
                });

                inputAtivo.on("blur", function(){
                    layer.make( this );
                });

                inputAtivo.appendTo( parentElement ).focus();

                return true;
            },

            _build: function( attr, css ){

                attr = attr || {};
                css = css || {};

                // Insere o input a criação do texto, atribuindo-o a variável
                inputAtivo = $('<input/>').attr(attr).css(css)

                return inputAtivo;
            },

            // Retorna uma string para ser usada como ID dos elementos
            buildId: function(){
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for( var i=0; i < 8; i++ )
                    text += possible
                        .charAt(Math.floor(Math.random() * possible.length));

                return text;
            },
        },

        layer = {

            make: function( input ){

                if(input != null){

                    if ( ( $(input) ).val() != "" ) {

                        var layerContent = $('<div/>').attr({
                            class: 'layerContent',
                        }).text( $(input).val() )

                        // Insere uma div
                        var layerDiv = $('<div/>').attr({
                            id: $(input).attr("id").replace("input", "layer"),
                            class: 'layer ' + settings.layerClass
                        }).css({
                            width: $(input).width(),
                            height: $(input).height(),
                            left: $(input).position().left,
                            position: 'absolute',
                            top: $(input).position().top,
                            display: 'table'
                        })
                        .draggable( {containment: "parent"} )
                        .resizable({
                            start: function( event, ui ) {
                                $( this ).addClass( "selected" );
                            }
                        })

                        .hover(

                            function() {
                                $( this ).addClass( "selected" );
                            },

                            function() {

                                var isSelected = data

                                .isSelected( layer.getId( $( this ) ) );

                                if ( !isSelected ) {
                                    $( this ).removeClass( "selected" );
                                }
                            }
                        )

                        .appendTo( parentElement );

                        layerContent.appendTo( layerDiv );

                        $(input).remove();

                        // Registra click para a layer, (para seleção)
                        layerDiv.on("click", function( e ){
                            data.select( layer.getId( layerDiv ), e);
                        });

                        // Registra dblclick para a layer, (para edição)
                        layerDiv.on("dblclick", function(){
                            $( parentElement ).off( 'dblclick' );
                            layer.edit( layerDiv );
                        });

                        data.add( layerDiv );
                        return layerDiv;
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
                    left: layer.position().left,
                    position: 'absolute',
                    top: layer.position().top
                }

                // Insere o input a criação do texto, atribuindo-o a variável
                inputAtivo = inputLayer._build( attr, css );

                layer.hide();

                inputAtivo.val( layer.children( ".layerContent" ).text() );

                // Se digitar enter ou perder o foco
                inputAtivo.on("keypress", function(e) {
                    if(e.which == 13) {
                        returnLayer();
                    }
                }).on(" blur", function(e){
                    returnLayer();
                })

                inputAtivo.appendTo( parentElement ).focus();

                // Chamada quando retorna da edição para a layer
                var returnLayer = function(){

                    // Se o input estiver vazio exclui a layer
                    if ( inputAtivo.val() == "" ) {
                        data.remove( layer );
                    }

                    layer.children( ".layerContent" ).text( inputAtivo.val() );

                    layer.show();

                    data.edit( layer )

                    inputAtivo.remove();

                    applyParentElementCallBacks();
                }
            },

            remove: function( layer ){
                layer.remove();
            },

            getId: function( layer ){
                return getId( layer );
            }
        },

        // Armazena dados gerais de todos as layers inseridas no quadro
        data = {

            // Armazena as layers inseridas no quadro
            layers: [],

            // Armazena as layers que estão selecionadas
            selected: [],

            // Adiciona um layer no objeto layers
            add: function( _layer ){

                var layerId = this.getId( _layer );

                if ( !( layerId in this.layers ) ) {

                    // Remove as classes ui-draggable ui-draggable-handle ui-resizable
                    // pois serão inseridas novamente
                    _layer.removeClass("ui-draggable ui-draggable-handle ui-resizable");

                    this.layers.push( this.sanitize( _layer ) );
                }

                // Adiciona a layer a lista do painel
                panelLayerList.add( _layer );

                // Seleciona a layer inserida
                this.select( layerId, null );

                return data;
            },

            edit: function( _layer ){
                this.layers[ this.getId( _layer ) ] = this.sanitize( _layer );
                panelLayerList.edit( _layer )
            },

            remove: function( _layer ){

                layerId = this.getId( _layer );

                var _layers = [];

                $.each(this.layers, function( index, value ) {
                    if ( layerId != index ) {
                        _layers[ index ] = value;
                    }
                });

                this.layers = _layers;

                panelLayerList.remove( _layer );

                layer.remove( _layer );
            },

            // Seleciona uma layer existente no quadro
            select: function( layerId, event ){

                var multiple = false;

                // Se a tecla [ CTRL ] estiver pressionada, verifica se
                // o elemento clicado está selecionado, se sim, desseleciona
                if ( event != null ) {

                    if ( event.ctrlKey ) {

                        var  isSelected = data.isSelected( layerId );

                        if ( isSelected ) {
                            this.deselect( layerId );
                            return true;
                        }else{
                            multiple = true;
                        }
                    }
                }

                if ( !multiple ) {

                    // Desseleciona qualquer outra layer que esteja selecionada
                    this.deselectAll();
                }

                this.selected.push( layerId );

                // Marca em (textImagePanelElementLayerList) o ítem selecionado
                $( "#id_li_text_" + layerId )
                .addClass( "selected" );

                // Marca no quadro o elemento selecionado
                $( "#id_layer_text_" + layerId ).addClass( "selected" );

                return true;
            },

            // Verifica se uma layer está selecionada
            isSelected: function( id ){

                for (var i = this.selected.length - 1; i >= 0; i--) {

                    if ( this.selected[i] == id ){
                        return true;
                    }

                }

                return false;
            },

            // Desseleciona uma layer específica
            deselect: function( id ){

                // no menu...
                $( "#id_li_text_" + id )
                .removeClass( "selected" );

                // no quadro...
                $( "#id_layer_text_"+ id )
                .removeClass( "selected" );

                var _selected = [];
                for (var i = this.selected.length - 1; i >= 0; i--) {

                    if ( this.selected[i] != id ){
                        _selected.push( this.selected[i] );
                    }
                }

                this.selected = _selected;
            },

            // Desmarca todos os elementos que estejam marcados
            deselectAll:  function(){

                for (var i = this.selected.length - 1; i >= 0; i--) {
                    this.deselect( this.selected[i] );
                }

                return true;
            },

            getId: function( layer ){
                return getId( layer );
            },

            sanitize: function( layer ){

                var layerId = this.getId( layer );

                return {
                    id: layerId,
                    attrs: {
                        id: layer.attr("id"),
                        class: layer.attr("class")
                    },

                    css: {
                        width: layer.width(),
                        height: layer.height(),
                        left: layer.position().left,
                        position: "absolute",
                        top: layer.position().top,
                        display: 'table'
                    },

                    text: layer.text()
                }
            }
        },

        panelLayerList = {

            add: function( layer ){

                var id = this.getId( layer );

                $( settings.textImagePanelElementLayerList ).append(
                    $('<li/>', {
                        'id': "id_li_text_" + id
                    }).append(
                        $('<a/>', {
                            'href': '#',
                            'text': layer.text()
                        })
                    ).on("mousedown", function( event ){
                        data.select( id, event )
                    })
                );
            },

            edit: function( layer ){

                var id = this.getId( layer );

                $( "#" + "id_li_text_" + id ).text( layer.text() );

                // applyParentElementCallBacks();
            },

            remove: function( layer ){

                var id = this.getId( layer );

                $("#id_li_text_" + id ).remove();
            },

            getId: function( layer ){
                return getId( layer );
            }
        }

        // Função universal para pegar o identificador de uma layer
        // A layer deve ser passada como objeto JQuery $( layer )
        function getId( layer ){
            return layer.attr("id").split("_").pop(-1);
        }
    };
}( jQuery ));
