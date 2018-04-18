var response;
var selected;
var id = "info";
var id2= "resp"
var contador = 0;
var contador2 = 0; 
var pontuacao = 0;
var personagem_selecionado;

var form = $("#form-concluir");
var indice_selecionado = -1; //Índice do item selecionado na lista
var tbJogadores = localStorage.getItem("tbJogadores");// Recupera os dados armazenados
tbJogadores = JSON.parse(tbJogadores); // Converte string para objeto
if(tbJogadores == null){ // Caso não haja conteúdo, iniciamos um vetor vazio
tbJogadores = [];
}

$(document).ready(function(){
    $("#exampleModalCenter").modal({
        keyboard: false
    });
        
    document.querySelector('#personagens').onchange = selecionar_personagem;
    
    pegar_personagens();

//    function NASort(a, b) {    
//    if (a.innerHTML == 'NA') {
//        return 1;   
//    }
//    else if (b.innerHTML == 'NA') {
//        return -1;   
//    }       
//    return (a.innerHTML > b.innerHTML) ? 1 : -1;
//    };
//    $('select#personagens option').sort(NASort).appendTo('select#personagens');
    
});

function pegar_personagens(){
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                response = JSON.parse(httpRequest.responseText); 
                
                var lista = document.querySelector('#personagens');
                var lista2 = document.querySelector('#filmes');
                var personagem = document.querySelector('#cards-personagens');

                response.results.forEach(function(el){
                    option = document.createElement("option");
                    texto = document.getElementById(id + contador++);
                    resp = document.getElementById(id2 + contador2++);

                    option.innerHTML = el.name;
                    texto.setAttribute('id', el.name);
                    resp.setAttribute('id', el.name);

//                    option.setAttribute('films', JSON.stringify(el.films));
                    texto.setAttribute('films', JSON.stringify(el.films));
                    texto.setAttribute('vehicles', JSON.stringify(el.vehicles));
                    texto.setAttribute('starships', JSON.stringify(el.starships));
                    texto.setAttribute('species', JSON.stringify(el.species));
                    
                    
                    lista.appendChild(option);
                    
                });
            }
        }
    }    
    httpRequest.open('GET', 'https://swapi.co/api/people/');
    httpRequest.send();
}


function selecionar_personagem(ev){
    personagem_selecionado = ev.target.selectedOptions[0].text;
}


function mostrar_ajuda(obj){
    $('#modalInfo').modal();
    pontuacao = pontuacao - 5;
    obj.setAttribute('style', 'display: none;');
    films = JSON.parse(obj.getAttribute('films'));
    vehicles = JSON.parse(obj.getAttribute('vehicles'));
    starships = JSON.parse(obj.getAttribute('starships'));
    
    var lista_filmes = document.querySelector("#filmes");
    var lista_veiculos = document.querySelector("#veiculos");
    var lista_naves = document.querySelector("#naves");
    
    lista_filmes.innerHTML = "";
    lista_veiculos.innerHTML = "";
    lista_naves.innerHTML = "";
    

    films.forEach(function(url){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    film = JSON.parse(httpRequest.responseText);

                    li_filme = document.createElement("li");
                    
                    li_filme.innerHTML = film.title;
                    
                    lista_filmes.appendChild(li_filme);                    
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    });
    
    vehicles.forEach(function(url){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    vehicle = JSON.parse(httpRequest.responseText);

                    li_veiculo = document.createElement("li");
                    
                    li_veiculo.innerHTML = vehicle.name;
                    
                    lista_veiculos.appendChild(li_veiculo);                    
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    });
    
    starships.forEach(function(url){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    starship = JSON.parse(httpRequest.responseText);

                    li_naves = document.createElement("li");
                    
                    li_naves.innerHTML = starship.name;
                    
                    lista_naves.appendChild(li_naves);                    
                }
            }
        };
        httpRequest.open('GET', url);
        httpRequest.send();
    });
};


var tempo = 1000;
function DispararTempo(){

    $("#exampleModalCenter").modal('hide');    
    var timer2 = "2:00";
    var interval = setInterval(function() {        
        var timer = timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;
        $('.countdown').html(minutes + ':' + seconds);
        timer2 = minutes + ':' + seconds;
        if (timer2 == "0:00") {
            clearInterval(interval);
            finalizarQuiz();
        }else if(timer2 == "1:00"){
            $("#relogio").attr('style', 'color: #FFD700;font-size: 32px');
        }else if(timer2 == "0:30"){
            $("#relogio").attr('style', 'color: #FF6347;font-size: 32px');    
        };    
    }, tempo);
};        

function finalizarQuiz(){
    $("#pontuacao").html(pontuacao);
    $("#ModalConcluir").modal({
        keyboard: false
    });
}


$("#form-concluir").validate({
    rules : {
             Nome:{
                    required:true,
                    minlength:3
             },
             Email:{
                    required:true
             }                         
       },
       messages:{
             Nome:{
                    required:"Por favor, informe seu nome",
                    minlength:"O nome deve ter pelo menos 3 caracteres"
             },
             Email:{
                    required:"Por favor, informe seu email"
             }  
       }
});

function responder(id, objeto){
    $('#modalResp').modal();
    
    randomizarComboBox();
    
    $("#btn_responder").click(function(elemento){
        if (id == personagem_selecionado) {
            pontuacao = pontuacao + 10;
            var elementoPai = document.getElementById(id).parentNode;
            var elementoVo = elementoPai.parentNode;
            document.getElementById(id).parentNode.setAttribute('style', 'display: none;');
            elementoPai.parentNode.setAttribute('style', 'display: none;');
            elementoVo.parentNode.innerHTML = "<h3 style='color: green;'>ACERTOU<br><br><br> +10 pontos</h3>";
            $('#btn_responder').off('click');
            $('#modalResp').modal('hide');
        }else{
            pontuacao = pontuacao + 0;
            var elementoPai = document.getElementById(id).parentNode;
            var elementoVo = elementoPai.parentNode;
            document.getElementById(id).parentNode.setAttribute('style', 'display: none;');
            elementoPai.parentNode.setAttribute('style', 'display: none;');
            elementoVo.parentNode.innerHTML = "<h3 style='color: red;'>Errou<br><br> +0 pontos</h3>";
            $('#modalResp').modal('hide');
            $('#btn_responder').off('click');
        }
    });
}

function randomizarComboBox(){
    var n;
    var selects = $('select#personagens');
    for(n = 0; n < selects.length; n++){
      var options = $('select#personagens:eq('+n+') option');
       //console.log(opt);
      var arr = options.map(function(_, o) {
        return {
            t: $(o).text(),
            v: o.value
        };
        }).get();
        arr.sort(function(o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        options.each(function(i, o) {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
    }
}

form.submit(function SalvarDados() {
    if (form.valid()) {
        var jogador = JSON.stringify({
		Nome     : $("#Nome").val(),
		Email    : $("#Email").val(),
        Pontuacao : $("#pontuacao").text()
	});
    
        tbJogadores.push(jogador);
        localStorage.setItem("tbJogadores", JSON.stringify(tbJogadores));
        window.location.href = 'index.html';        
    }
    return false;
});

function modalRanking(){
    $("#modalRanking").modal();
    Listar();
};

function Listar(){
    $("#tblListar").html("");
    $("#tblListar").html(
        "<thead>"+
        "   <tr>"+
        "   <th>Pontuação</th>"+
        "   <th>Nome</th>"+
        "   <th>Email</th>"+
        "   </tr>"+
        "</thead>"+
        "<tbody>"+
        "</tbody>"
        );
    for(var i in tbJogadores.sort()){
        var cli = JSON.parse(tbJogadores[i]);
        $("#tblListar tbody").append("<tr>");
        $("#tblListar tbody").append("<td id='pontos'>"+cli.Pontuacao+"</td>");
        $("#tblListar tbody").append("<td>"+cli.Nome+"</td>");
        $("#tblListar tbody").append("<td>"+cli.Email+"</td>");
        $("#tblListar tbody").append("</tr>");
    }
}    









