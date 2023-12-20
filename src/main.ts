import './style.scss'

import Hummingbird from './hummingbird'
import PencilController from './pencil-controller'

const GAME_WIDTH = 1000
const GAME_HEIGHT = 600

let scaleRatio: number = 1
let previousTime: number | null = null
let gameStarted: boolean = false
let gameOver: boolean = false
let shouldShowInstructions: boolean = false
let shouldShowInstructionsTimeout: number | null = null
let hasAddedEventListenersForRestart: boolean = false
let gamePoints: number = 0
let highScore: number = 0

// screen
const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

// game objects
const HUMMINGBIRD_WIDTH = 32
const HUMMINGBIRD_HEIGHT = 32
let hummingbird: Hummingbird | null = null
let pencilController: PencilController | null = null

// physics
const GAME_SPEED_START = .3
// TODO: Implement game speed increases
const GAME_SPEED_INCREMENT = 0.0000001
let gameSpeed = GAME_SPEED_START

const getScaleRatio = () => {
  const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight)

  // window is wider
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH
  } else {
    return screenHeight / GAME_HEIGHT
  }
}

const setScreen = () => {
  scaleRatio = getScaleRatio()
  canvas.width = GAME_WIDTH * scaleRatio
  canvas.height = GAME_HEIGHT * scaleRatio

  createSprites()
}

const clearScreen = () => {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const createSprites = () => {
  const hummingbirdScaledWidth = HUMMINGBIRD_WIDTH * scaleRatio
  const hummingbirdScaledHeight = HUMMINGBIRD_HEIGHT * scaleRatio

  hummingbird = new Hummingbird(ctx, hummingbirdScaledWidth, hummingbirdScaledHeight, scaleRatio)

  pencilController = new PencilController(ctx, 64, scaleRatio, gameSpeed)
}

const showInstructions = () => {
  const fontSize = 25 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px Verdana`
  ctx.fillStyle = 'grey'
  const x = canvas.width / 2
  const y = canvas.height / 2
  ctx.fillText('Press space to jump', x, y)
}

const showGameOver = () => {
  showPointCounter()
  showHighScore()
  const fontSize = 70 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px Verdana`
  ctx.fillStyle = 'grey'
  const x = canvas.width / 2
  const y = canvas.height / 2.25
  ctx.fillText('GAME OVER', x, y)
}

const showPointCounter = () => {
  const fontSize = 50 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px Verdana`
  ctx.fillStyle = 'grey'
  const x = canvas.width / 2
  const y = canvas.height / 4
  ctx.fillText(String(gamePoints), x, y)
}

const showHighScore = () => {
  const fontSize = 50 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px Verdana`
  ctx.fillStyle = 'grey'
  const x = canvas.width / 2
  const y = canvas.height / 8
  ctx.fillText(`High Score: ${highScore}`, x, y)
}

const incrementPoints = () => {
  pipeController && hummingbird && pipeController.hasPassed(hummingbird) && (gamePoints += 1)
}

const startGame = (event: KeyboardEvent) => {
  if (event.code === 'Space') {
    if (!gameStarted) {
      gameStarted = true
    }
  }
}

const setupGameReset = () => {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true

    setTimeout(() => {
      window.addEventListener('keydown', reset, { once: true })
    }, 250)
  }
}

// listeners
window.addEventListener('resize', setScreen)
window.addEventListener('keydown', startGame)

const reset = () => {
  hasAddedEventListenersForRestart = false
  gameOver = false
  shouldShowInstructions = false
  shouldShowInstructionsTimeout && clearTimeout(shouldShowInstructionsTimeout)
  hummingbird && hummingbird.reset()
  pencilController && pencilController.reset()
  gameSpeed = GAME_SPEED_START
  gamePoints = 0
}

const gameLoop = (currentTime: number) => {
  clearScreen()

  if (previousTime === null) {
    previousTime = currentTime
    requestAnimationFrame(gameLoop)
    return
  }

  // for tracking varying monitor speeds
  const frameDelta = currentTime - previousTime
  previousTime = currentTime


  if (!gameOver && gameStarted) {
    // update game objects
    hummingbird && hummingbird.update(frameDelta)
    pencilController && pencilController.update(frameDelta)
  }

  if (!gameOver && hummingbird && pencilController && (hummingbird.collide() || pencilController.collideWith(hummingbird))) {
    gameOver = true
    shouldShowInstructionsTimeout = setTimeout(() => {
      shouldShowInstructions = true
    }, 500)
    setupGameReset()
  }

  // draw game objects
  hummingbird && hummingbird.draw()
  pencilController && pencilController.draw()

  if (gameOver) {
    showGameOver()
  }

  if (!gameStarted || shouldShowInstructions) {
    showInstructions()
  }

  requestAnimationFrame(gameLoop)
}

setScreen()
requestAnimationFrame(gameLoop)