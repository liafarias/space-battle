function start() {

	$("#inicio").hide();

	$("#fundoGame").append("<div id='jogador'></div>");

	$("#fundoGame").append("<div id='inimigo1'></div>");

	$("#fundoGame").append("<div id='inimigo2'></div>");

	$("#fundoGame").append("<div id='placar'></div>");

	$("#fundoGame").append("<div id='energia'></div>");

	//PRINCIPAIS VARIAVEIS DO JOGO
	var jogo = {};
	var energiaAtual = 3;
	var fimdejogo = false;
	var pontos = 0;
	var velocidade = 5;
	var posicaoY = parseInt(Math.random() * 334);
	var podeAtirar = true;
	var TECLA = {
		W: 87,
		S: 83,
		D: 68
	}

	jogo.pressionou = [];

	var somDisparo = document.getElementById("somDisparo");
	var somExplosao = document.getElementById("somExplosao");
	var musica = document.getElementById("musica");
	var somGameover = document.getElementById("somGameover");

	//Música em loop
	musica.addEventListener("ended", function () {
		musica.currentTime = 0;
		musica.play();
	}, false);
	musica.play();

	//VERIFICAR SE O JOGADOR APERTOU AS TECLAS
	$(document).keydown(function (e) {
		jogo.pressionou[e.which] = true;
	});


	$(document).keyup(function (e) {
		jogo.pressionou[e.which] = false;
	});

	//GAME LOOP
	jogo.timer = setInterval(loop, 30);

	function loop() {

		movejogador();
		moveinimigo1();
		moveinimigo2();
		colisao();
		placar();
		energia();

	} // FIM DO GAME LOOP

	//FUNÇÃO MOVE JOGADOR
	function movejogador() {

		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo - 10);
			if (topo <= 0) {

				$("#jogador").css("top", topo + 10);
			}

		}

		if (jogo.pressionou[TECLA.S]) {

			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo + 10);
			if (topo >= 500) {
				$("#jogador").css("top", topo - 10);

			}
		}

		if (jogo.pressionou[TECLA.D]) {

			disparo(); //FUNÇÃO PARA CHAMAR O DESPARO
		}

	} // FIM DA FUNÇÃO MOVE JOGADOR

	//FUNÇÃO MOVE INIMIGO 1
	function moveinimigo1() {

		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left", posicaoX - velocidade);
		$("#inimigo1").css("top", posicaoY);

		if (posicaoX <= 0) {
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);

		}
	} //FIM DA FUNÇÃO MOVE INIMIGO 1

	//FUNÇÃO MOVE INIMIGO 2
	function moveinimigo2() {
		posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left", posicaoX - 3);

		if (posicaoX <= 0) {

			$("#inimigo2").css("left", 775);

		}
	} //FIM DA FUNÇÃO MOVE INIMIGO 2

	//FUNÇÃO PARA CHAMAR O DESPARO
	function disparo() {

		somDisparo.play();
		if (podeAtirar == true) {

			podeAtirar = false;

			topo = parseInt($("#jogador").css("top"))
			posicaoX = parseInt($("#jogador").css("left"))
			tiroX = posicaoX + 190;
			topoTiro = topo + 37;
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top", topoTiro);
			$("#disparo").css("left", tiroX);

			var tempoDisparo = window.setInterval(executaDisparo, 10);

		} //Fecha podeAtirar

		function executaDisparo() {
			posicaoX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left", posicaoX + 15);

			if (posicaoX > 900) {

				window.clearInterval(tempoDisparo);
				tempoDisparo = null;
				$("#disparo").remove();
				podeAtirar = true;

			}
		} // Fecha executaDisparo()

	} // FIM DA FUNÇÃO CHAMAR DESPARO

	//FUNÇÃO PARA COLISÃO

	function colisao() {
		var colisao1 = ($("#jogador").collision($("#inimigo1")));
		var colisao2 = ($("#jogador").collision($("#inimigo2")));
		var colisao3 = ($("#disparo").collision($("#inimigo1")));
		var colisao4 = ($("#disparo").collision($("#inimigo2")));
		// jogador com o inimigo1

		if (colisao1.length > 0) {

			energiaAtual--;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X, inimigo1Y);

			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);
		}

		// jogador com o inimigo2 
		if (colisao2.length > 0) {

			energiaAtual--;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X, inimigo2Y);

			$("#inimigo2").remove();

			reposicionaInimigo2();

		}

		// DISPARO COM O INIMIGO 1

		if (colisao3.length > 0) {
			velocidade = velocidade + 0.4;
			pontos = pontos + 100;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));

			explosao1(inimigo1X, inimigo1Y);
			$("#disparo").css("left", 950);

			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);
		}

		// Disparo com o inimigo2

		if (colisao4.length > 0) {
			velocidade = velocidade + 0.2;
			pontos = pontos + 50;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();

			explosao2(inimigo2X, inimigo2Y);
			$("#disparo").css("left", 950);

			reposicionaInimigo2();

		}

	} //FIM DA FUNÇÃO DE COLISÃO

	//FUNÇÃO DA EXPLOSÃO 1
	function explosao1(inimigo1X, inimigo1Y) {

		somExplosao.play();
		$("#fundoGame").append("<div id='explosao1'></div");
		$("#explosao1").css("background-image", "url(./img/explosao.png)");
		var div = $("#explosao1");
		div.css("top", inimigo1Y);
		div.css("left", inimigo1X);
		div.animate({
			width: 200,
			opacity: 0
		}, "slow");

		var tempoExplosao = window.setInterval(removeExplosao, 1000);

		function removeExplosao() {

			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;

		}

	} //FIM DA FUNÇÃO EXPLOSÃO 1

	//FUNÇÃO PARA REPOSICIONAR INIMIGO 2
	function reposicionaInimigo2() {

		var tempoColisao4 = window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4 = null;

			if (fimdejogo == false) {

				$("#fundoGame").append("<div id=inimigo2></div");

			}

		}
	} // FIM DA FUNÇÃO REPOSICIONAR INIMIGO 2

	//EXPLOSÃO 2

	function explosao2(inimigo2X, inimigo2Y) {
		somExplosao.play();
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(./img/explosao.png)");
		var div2 = $("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.animate({
			width: 200,
			opacity: 0
		}, "slow");

		var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

		function removeExplosao2() {

			div2.remove();
			window.clearInterval(tempoExplosao2);
			tempoExplosao2 = null;

		}


	} // FIM DA EXPLOSÃO 2

	//FUNÇÃO PARA ATUALIZAR O PLACAR
	function placar() {

		$("#placar").html("<h3> Pontos: " + pontos + "</h3>");

	} //FIM DA FUNÇÃO PARA ATUALIZAR O PLACAR

	// FUNÇÃO PARA FAZER A BARRA DE ENERGIA

	function energia() {

		if (energiaAtual == 3) {

			$("#energia").css("background-image", "url(img/energia3.png)");
		}

		if (energiaAtual == 2) {

			$("#energia").css("background-image", "url(img/energia2.png)");
		}

		if (energiaAtual == 1) {

			$("#energia").css("background-image", "url(img/energia1.png)");
		}

		if (energiaAtual == 0) {

			$("#energia").css("background-image", "url(img/energia0.png)");
			gameOver();
			
		}
			//FUNÇÃO GAME OVER
			function gameOver() {
				fimdejogo = true;
				musica.pause();
				somGameover.play();

				window.clearInterval(jogo.timer);
				jogo.timer = null;

				$("#jogador").remove();
				$("#inimigo1").remove();
				$("#inimigo2").remove();

				$("#fundoGame").append("<div id='fim'></div>");

				$("#fim").html("<h2> GAME OVER </h2><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
			} // FIM DA FUNÇÃO GAMEOVER

	} // FIM DA FUNÇÃO BARRA DE ENERGIA

} //FIM DA FUNÇÃO START

//Reinicia o Jogo
		
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
} //Fim da função reiniciaJogo