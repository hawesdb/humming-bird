import { useEffect, useRef } from 'react'
import {
  Hummingbird,
  PencilController,
  Ground,
  showInstructions,
  showPointCounter,
  showGameOver,
} from './objects'

const GAME_WIDTH = 800
const GAME_HEIGHT = 400

// physics
const GAME_SPEED_START = 0.15
const GAME_SPEED_INCREMENT = 0.000005

export const HummingbirdGame = () => {
  // screen
  let canvas = useRef<HTMLCanvasElement>(null)
  let ctx = useRef<CanvasRenderingContext2D | null>(null)
  let scaleRatio: number = 1

  let gameSpeed: number = GAME_SPEED_START
  let previousTime: number | null = null
  let gameStarted: boolean = false
  let gameOver: boolean = false
  let gamePoints: number = 0
  let highScore: number = 0

  // game objects
  let hummingbird: Hummingbird | null = null
  let pencilController: PencilController | null = null
  let ground: Ground | null = null

  let shouldShowInstructions: boolean = false
  let shouldShowInstructionsTimeout: NodeJS.Timeout | null = null
  let hasAddedEventListenersForRestart: boolean = false

  useEffect(() => {
    window.addEventListener('resize', setScreen)
    window.addEventListener('keydown', startGame)
    // eslint-disable-next-line react-hooks/exhaustive-deps

    return () => {
      window.removeEventListener('resize', setScreen)
      window.removeEventListener('keydown', startGame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (canvas.current) {
      canvas.current.style.backgroundColor = 'white'
      ctx.current = canvas.current.getContext('2d')
      setScreen()
      requestAnimationFrame(gameLoop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas.current])

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
    if (canvas.current && ctx.current) {
      scaleRatio = getScaleRatio()

      canvas.current.width = GAME_WIDTH * scaleRatio
      canvas.current.height = GAME_HEIGHT * scaleRatio

      hummingbird = new Hummingbird(ctx.current, scaleRatio)
      pencilController = new PencilController(ctx.current, scaleRatio)
      ground = new Ground(ctx.current, scaleRatio)
    }
  }

  const clearScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
        window.addEventListener('keydown', reset)
      }, 500)
    }
  }

  const reset = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      gameOver = false
      shouldShowInstructions = false
      shouldShowInstructionsTimeout && clearTimeout(shouldShowInstructionsTimeout)
      hummingbird && hummingbird.reset()
      pencilController && pencilController.reset()
      gameSpeed = GAME_SPEED_START
      gamePoints = 0

      window.removeEventListener('keydown', reset)
      hasAddedEventListenersForRestart = false
    }
  }

  const incrementPoints = () => {
    pencilController &&
      hummingbird &&
      pencilController.hasPassed(hummingbird) &&
      (gamePoints += 1)
  }

  const gameLoop = (currentTime: number) => {
    clearScreen(canvas.current!, ctx.current!)

    // for tracking varying monitor speeds
    if (previousTime === null) {
      previousTime = currentTime
      requestAnimationFrame(gameLoop)
      return
    }
    const frameDelta = currentTime - previousTime
    previousTime = currentTime

    // update game objects
    if (gameStarted && !gameOver) {
      hummingbird && hummingbird.update(frameDelta)
      pencilController && pencilController.update(frameDelta, gameSpeed)
      ground && ground.update(frameDelta)
    }

    if (
      !gameOver &&
      hummingbird &&
      pencilController &&
      (hummingbird.collide() || pencilController.collideWith(hummingbird))
    ) {
      highScore = Math.max(gamePoints, highScore)
      gameOver = true
      shouldShowInstructionsTimeout = setTimeout(() => {
        shouldShowInstructions = true
      }, 500)
      setupGameReset()
    }

    // draw game objects
    ground && ground.draw()
    pencilController && pencilController.draw()
    hummingbird && hummingbird.draw()

    // draw points counter
    incrementPoints()
    !gameOver &&
      gameStarted &&
      showPointCounter(canvas.current!, ctx.current!, scaleRatio, gamePoints)

    if (!gameStarted || shouldShowInstructions) {
      showInstructions(canvas.current!, ctx.current!, scaleRatio)
    }

    if (gameOver) {
      showGameOver(
        canvas.current!,
        ctx.current!,
        scaleRatio,
        gamePoints,
        highScore,
      )
    }

    if (!gameOver) {
      gameSpeed += GAME_SPEED_INCREMENT
    }

    requestAnimationFrame(gameLoop)
  }

  return <canvas id='hummingbird-game' ref={canvas}></canvas>
}
