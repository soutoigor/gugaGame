function createAnim() {
  'use strict'
  const $pointScore = document.querySelector('#score')
  const $missScore = document.querySelector('#misses')
  const $reset = document.querySelector('#reset')
  const $record = document.querySelector('#record')
  const $help = document.querySelector('#help')
  let point = 0
  let miss = 0
  let increasePad = 0

  const soundWall = new Howl({
    src: ['sound/beep5.wav']
  })
  const soundRacket = new Howl({
    src: ['sound/beep1.wav']
  })
  const soundLose = new Howl({
    src: ['sound/beep3.wav']
  })
  const soundReset = new Howl({
    src: ['sound/Reset.wav']
  })

  const shoundCheckpoint = new Howl({
    src: ['sound/10-pontos.wav']
  })

  const scene = oCanvas.create({
    canvas: '#canvas',
    background: '#111'
  })

  const ball = scene.display.arc({
    x: 25,
    y: 25,
    radius: 10,
    start: 0,
    end: 360,
    fill: '#ff0',
    velocX: 10,
    velocY: 10
  })
  scene.addChild(ball)

  const pad = scene.display.rectangle({
    x: 25,
    y: 400,
    width: 50,
    height: 10,
    fill: '#ff0',
    velocX: 5,
    velocY: 5
  })
  scene.addChild(pad)

  scene.bind('mousemove', () => {
    pad.x = scene.mouse.x
  })

  scene.setLoop(() => {
    ball.move(ball.velocX, ball.velocY)

    hitWall()

    if (ball.y > (pad.y - pad.height)) {
      if ((ball.x > pad.x) && (ball.x < (pad.x + pad.width))) {
        ball.velocY = -ball.velocY
        setPoint()
      } else {
        ball.x = 25
        ball.y = 25
        setMiss()
      }
    }
  }).start()

  const setPoint = () => {
    soundRacket.play()
    point++
    increasePad++
    if (increasePad === 10) {
      pad.width += 10
      increasePad = 0
      shoundCheckpoint.play()
    }
    $pointScore.textContent = point
  }

  const setMiss = () => {
    soundLose.play()
    miss++
    $missScore.textContent = miss
    pad.width -= 5
    if (!pad.width) {
      gameOver()
    }
  }

  const getRecord = () => (
    localStorage.getItem('record')
  )

  const setRecord = () => {
    if (($pointScore.textContent > getRecord()) && ($pointScore.textContent)) {
      localStorage.clear()
      localStorage.setItem('record', $pointScore.textContent)
    }
  }

  const reload = (time) => {
    setTimeout(() => {
      location.reload()
    }, time)
  }

  const gameOver = () => {
    ball.velocX = 0
    ball.velocY = 0
    setRecord()
    swal('GAME OVER!', {
      icon: 'images/skull.png',
      buttons: false,
      timer: 2000,
    })
    reload(2500)
  }

  const hitWall = () => {
    if ((ball.x <= 0) || (ball.x >= (scene.width))) {
      ball.velocX = -ball.velocX
      soundWall.play()
    }
    if (ball.y < 20) {
      ball.velocY = -ball.velocY
      soundWall.play()
    }
  }

  $reset.addEventListener('click', (e) => {
    e.preventDefault()
    soundReset.play()
    reload(1000)
  })

  $help.addEventListener('click', (e) => {
    e.preventDefault()
    swal({
      text: 'Mova o mouse para guiar a raquete e não deixar a bolinha cair.\nA cada 10 acertos, a raquete irá aumentar, e a cada erro, ela diminui.',
      icon: 'images/mouse-guide.png',
    })
  })

  $record.textContent = getRecord() || 0

}
