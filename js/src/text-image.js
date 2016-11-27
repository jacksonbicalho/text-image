
;(function( undefined ) {
  'use strict';

    require([ 'jquery' ], function( $ ) {

        // Basicamente vai inserir o manipulador dblclick para o quadro #text-image
        // permitindo a criação de inputs para a inserção de textos
        OnOff('#text-image', "dblclick", onInsertInput)

        // Registra o manipulador de eventos dblclick para o quadro #text-image
        function onInsertInput(){
            $("#text-image").on("dblclick", function(evento){
                addInput(this, evento);
            });
        }

        // Cria um novo texto dentro do quadro
        function addInput(objeto, evento) {

            // Difene uma lçargura padrão para o input de texto
            var larguraInput = 250;

            // Define uma altura padrão para o input de texto
            var alturaInput = 17;

            // Obtém a posição do clique no objeto parent ao clicado
            var parentOffset = $(objeto).parent().offset();

            // Calcula a posição do clique no quadro
            var clickX = evento.pageX - parentOffset.left;
            var clickY = evento.pageY - parentOffset.top;

            // Impõe limites para a criação do input dentro do quadro
            if ( (clickX + larguraInput) > $(objeto).width() ) {
                clickX = larguraInput-10
            }
            if ( (clickY + alturaInput) > $(objeto).height() ) {
                clickY = $(objeto).height() - alturaInput - 10
            }

            // Obtém uma string para ser usada como id e nome do elemento
            var textoId = buildId();

            // Insere o input a criação do texto
            $('<input/>').attr({
                type: 'text',
                id: 'id_' + textoId,
                name: textoId,
            }).css({
                width: larguraInput,
                height: alturaInput,
                left: clickX,
                position: 'absolute',
                top: clickY
            }).appendTo(objeto);

            // Ao pressionar a tecla enter estando no input criado
            $('#id_' + textoId).keypress(function(e) {
                if(e.which == 13) {
                    OnOff(objeto, "dblclick", onInsertInput)
                }
            });

            // // Desabilita o manipulador do evento que insere o input
            // $( "#text-image" ).off("dblclick");
            OnOff(objeto, evento.type);
        }

        // Retorna uma string para ser usada como ID dos elementos
        function buildId(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        // Desabilita ou habilita um evento para um determinado objeto.
        // O parâmetro _function só é invocado quando o o evento não estiver ativo
        //
        function OnOff(objeto, eventoTipo, _function=[]){
            var ev = $._data(objeto, 'events');
            if(ev && ev[eventoTipo]){
                $( objeto ).off(eventoTipo);
            }else{
                _function();
            }
        }

    });
})();

