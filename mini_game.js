
function createAnim() {
	
    var $acertoPlacar = document.querySelector('#acertos');
    var $erroPlacar = document.querySelector('#erros');
    var $reset = document.querySelector('#reset');
    var $recorde = document.querySelector('#recorde');
    
    var acerto = 0;
    var erro = 0;
   
    
    var aumentaPad = 0;
        $recorde.textContent = getRecorde();
         
	
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
        setTimeout(function(){
            location.reload();
        }, 1000);
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
        if(aumentaPad == 5){
            pad.width += 10;
            aumentaPad = 0;
        }
    $acertoPlacar.textContent = acerto;
  }
  
  function setErro(){
    soundLose.play();
    erro++;
    $erroPlacar.textContent = erro;
    pad.width -= 5;
        if(!pad.width){
            
            alert('Game Over Troxa!');
            setRecorde();
            location.reload();
            
        }
  }
  
  function resetGame(){
      
    
        
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
    
    

}