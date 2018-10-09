
function createAnim() {
  'use strict';
// Declarando elementos do DOM
    var $acertoPlacar = document.querySelector('#acertos');
    var $erroPlacar = document.querySelector('#erros');
    var $reset = document.querySelector('#reset');
    var $recorde = document.querySelector('#recorde');
    var $help = document.querySelector('#help');
 // Contadores dos acertos e erros
    var acerto = 0;
    var erro = 0;

// Controle do aumento da raquete
    var aumentaPad = 0;

// Setando o valor mostrado no Recorde, caso não haja um recorde na memória, ele será 0.
    $recorde.textContent = getRecorde() || 0 ;


  // Declarando os sons do jogo
  var soundParede = new Howl({
    src: ['sound/beep5.wav']
  });
  var soundRaquete = new Howl({
    src: ['sound/beep1.wav']
  });
  var soundLose = new Howl({
    src: ['sound/beep3.wav']
  });
    var soundReset = new Howl({
    src: ['sound/Reset.wav']
  });

	var dezPontos = new Howl({
		src: ['sound/10-pontos.wav']
	});


  // Declarando e configurando o cenário
  var scene = oCanvas.create({
    canvas: "#canvas",
    background: "#111"
  });

  // Declarando, configurando e adicionando a bola
  var ball = scene.display.arc({
    x: 25,
    y: 25,
    radius: 10,
    start: 0,
    end: 360,
    fill: "#ff0",
    velocX: 10,
    velocY: 10
  });
  scene.addChild(ball);

    // Declarando, configurando e adicionando a raquete
  var pad = scene.display.rectangle({
    x: 25,
    y: 400,
    width: 50,
    height: 10,
    fill: "#ff0",
    velocX: 5,
    velocY: 5
  });
    scene.addChild(pad);

    //  Passa o movimento do mouse para o movimento do pad
    scene.bind("mousemove", function() {
      pad.x = scene.mouse.x;
    });

// Loop onde onde as ações do canvas irá acontecer
  scene.setLoop(function() {
// Fazendo a bolinha se mover
    ball.move(ball.velocX,ball.velocY)

// Fazendo a bolinha bater na parede e continuar se movendo
	hitWall();

// Se a bolinha acertar na raquete, continua se movendo e inclui um ponto de acerto
    if (ball.y > (pad.y - pad.height)) {
      if ((ball.x > pad.x) && (ball.x < (pad.x + pad.width))) {
        ball.velocY = -ball.velocY;
        setAcerto();
      }
/* Caso a bolinha não acerte nem a parede e nem a raquete, ela volta para seu valor de origem,
inclui um ponto de erro e diminui a raquete */
      else {
        ball.x =  25; //Math.floor(Math.random() * (300 - 25 + 1)) + 25;
        ball.y = 25;
        setErro();
        }
    }



  }).start();

// Inclui ponto de acerto, ativa o som de acerto e caso tenha 10 acertos, aumenta a raquete e ativa o som de 10 pontos
  function setAcerto(){
    soundRaquete.play();
    acerto++;
    aumentaPad++;
        if(aumentaPad == 10){
            pad.width += 10;
            aumentaPad = 0;
			      dezPontos.play();
        }
    $acertoPlacar.textContent = acerto;
  }

// Incluir ponto de erro, diminui a raquete e dispara os sons de erro. Caso a raquete acabe, ativa fim de jogo
  function setErro(){
    soundLose.play();
    erro++;
    $erroPlacar.textContent = erro;
    pad.width -=5;
        if(!pad.width){
			console.log('morreu');
          gameOver();
        }
  }

// Pega o recorde existente na memória
    function getRecorde(){
        return localStorage.getItem('recorde');
    }

// Caso acertos seja maior que recorde na memória, inclui novo recorde
   function setRecorde(){

        if(($acertoPlacar.textContent > getRecorde()) && ($acertoPlacar.textContent)){
            localStorage.clear();
            localStorage.setItem('recorde', $acertoPlacar.textContent);
        }

    }

// Recarrega a página no tempo determinado por parâmetro
	function reload(time){
		setTimeout(function(){
            location.reload();
        }, time);
  }

// Apresenta a modal de Game Over, ativa o recorde e recarrega a página
  function gameOver(){
    ball.velocX = 0;
    ball.velocY = 0;
    setRecorde();
    swal("GAME OVER!", {
		icon: 'images/skull.png',
        buttons: false,
        timer: 2000,
    });
  reload(2500);
  }

// Caso a bolinha bata na parede, o som é ativado e a bolinha continua se movimentando na direção oposta
  function hitWall(){
		if ((ball.x <= 0) || (ball.x >= (scene.width))) {
		      ball.velocX = -ball.velocX;
		      soundParede.play();
		    }
		    if (ball.y < 20) {
		      ball.velocY = -ball.velocY;
		      soundParede.play();
    }
	}

  // Ativa botão que reseta o jogo
      $reset.addEventListener('click', function(e){
        e.preventDefault();
        soundReset.play();
  	  	reload(1000);
      });

// Ativa o bot]ao de ajuda apresentando a modal.
      $help.addEventListener('click', function(e){
        e.preventDefault();
        swal({
          text: 'Mova o mouse para guiar a raquete e não deixar a bolinha cair.\nA cada 10 acertos, a raquete irá aumentar, e a cada erro, ela diminui.',
          icon: 'images/mouse-guide.png',
        });

    });

	


};