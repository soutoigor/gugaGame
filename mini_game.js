
function createAnim() {

    var $acertoPlacar = document.querySelector('#acertos');
    var $erroPlacar = document.querySelector('#erros');
    var $reset = document.querySelector('#reset');
    var $recorde = document.querySelector('#recorde');
    var $help = document.querySelector('#help');

    var acerto = 0;
    var erro = 0;


    var aumentaPad = 0;
        $recorde.textContent = getRecorde() || 0 ;


  // Sounds
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


  // Declarando cen�rio
  var scene = oCanvas.create({
    canvas: "#canvas",
    background: "#222"
  });

  // Declarando bola
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

    // Declarando raquete
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


    // reseta o jogo
    $reset.addEventListener('click', function(){
      soundReset.play();
	  	reload(1000);	
    });

    $help.addEventListener('click', function(){
      swal({
        text: 'Mova o mouse para guiar a raquete e não deixar a bolinha cair.',
        icon: 'mouse-guide.png',
      });
    });
    

  scene.setLoop(function() {
    ball.move(ball.velocX,ball.velocY)


    if ((ball.x <= 0) || (ball.x >= (scene.width))) {
      ball.velocX = -ball.velocX;
      soundParede.play();
    }
    if (ball.y < 20) {
      ball.velocY = -ball.velocY;
      soundParede.play();
    }
    if (ball.y > (pad.y - pad.height)) { //385
      if ((ball.x > pad.x) && (ball.x < (pad.x + pad.width))) {
        ball.velocY = -ball.velocY;
        setAcerto();


      } else {
        ball.x = 25;
        ball.y = 25;
        setErro();
        }
    }



  }).start();


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

  function setErro(){
    soundLose.play();
    erro++;
    $erroPlacar.textContent = erro;
    pad.width -= 5;
        if(!pad.width){
          gameOver();
        }
  }


    function getRecorde(){
        return localStorage.getItem('recorde');
    }

   function setRecorde(){

        if(($acertoPlacar.textContent > getRecorde()) && ($acertoPlacar.textContent)){
            localStorage.clear();
            localStorage.setItem('recorde', $acertoPlacar.textContent);
        }

    }
	
	function reload(time){
		setTimeout(function(){
            location.reload();
        }, time);
  }
  
  function gameOver(){
    ball.velocX = 0;
    ball.velocY = 0;
    setRecorde();
    swal("GAME OVER!", {
		icon: 'skull.png',
        buttons: false,
        timer: 2000,
    });
  reload(2500);	
  }
	


}