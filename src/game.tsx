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
  let scaleRatio = useRef<number>(1)

  let gameSpeed = useRef<number>(GAME_SPEED_START)
  let previousTime = useRef<number | null>(null)
  let gameStarted = useRef<boolean>(false)
  let gameOver = useRef<boolean>(false)
  let gamePoints = useRef<number>(0)
  let highScore = useRef<number>(0)

  // game objects
  let hummingbird = useRef<Hummingbird | null>(null)
  let pencilController = useRef<PencilController | null>(null)
  let ground = useRef<Ground | null>(null)

  let shouldShowInstructions = useRef<boolean>(false)
  let shouldShowInstructionsTimeout = useRef<NodeJS.Timeout | null>(null)
  let hasAddedEventListenersForRestart = useRef<boolean>(false)

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
      canvas.current.style.backgroundColor = 'green'
      ctx.current = canvas.current.getContext('2d')
      setScreen()
      requestAnimationFrame(gameLoop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas])

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
      scaleRatio.current = getScaleRatio()

      canvas.current.width = GAME_WIDTH * scaleRatio.current
      canvas.current.height = GAME_HEIGHT * scaleRatio.current

      hummingbird.current = new Hummingbird(ctx.current, scaleRatio.current)
      pencilController.current = new PencilController(ctx.current, scaleRatio.current)
      ground.current = new Ground(ctx.current, scaleRatio.current)
    }
  }

  const clearScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const startGame = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      if (!gameStarted.current) {
        gameStarted.current = true
      }
    }
  }

  const setupGameReset = () => {
    if (!hasAddedEventListenersForRestart.current) {
      hasAddedEventListenersForRestart.current = true

      setTimeout(() => {
        window.addEventListener('keydown', reset)
      }, 500)
    }
  }

  const reset = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      gameOver.current = false
      shouldShowInstructions.current = false
      shouldShowInstructionsTimeout.current && clearTimeout(shouldShowInstructionsTimeout.current)
      hummingbird.current && hummingbird.current.reset()
      pencilController.current && pencilController.current.reset()
      gameSpeed.current = GAME_SPEED_START
      gamePoints.current = 0

      window.removeEventListener('keydown', reset)
      hasAddedEventListenersForRestart.current = false
    }
  }

  const incrementPoints = () => {
    pencilController.current &&
      hummingbird.current &&
      pencilController.current.hasPassed(hummingbird.current) &&
      (gamePoints.current += 1)
  }

  const gameLoop = (currentTime: number) => {
    clearScreen(canvas.current!, ctx.current!)

    // for tracking varying monitor speeds
    if (previousTime.current === null) {
      previousTime.current = currentTime
      requestAnimationFrame(gameLoop)
      return
    }
    const frameDelta = currentTime - previousTime.current
    previousTime.current = currentTime

    // update game objects
    if (gameStarted.current && !gameOver.current) {
      hummingbird.current && hummingbird.current.update(frameDelta)
      pencilController.current && pencilController.current.update(frameDelta, gameSpeed.current)
      ground.current && ground.current.update(frameDelta)
    }

    if (
      !gameOver.current &&
      hummingbird.current &&
      pencilController.current &&
      (hummingbird.current.collide() || pencilController.current.collideWith(hummingbird.current))
    ) {
      highScore.current = Math.max(gamePoints.current, highScore.current)
      gameOver.current = true
      shouldShowInstructionsTimeout.current = setTimeout(() => {
        shouldShowInstructions.current = true
      }, 500)
      setupGameReset()
    }

    // draw game objects
    ground.current && ground.current.draw()
    pencilController.current && pencilController.current.draw()
    hummingbird.current && hummingbird.current.draw()

    // draw points counter
    incrementPoints()
    !gameOver.current &&
      gameStarted.current &&
      showPointCounter(canvas.current!, ctx.current!, scaleRatio.current, gamePoints.current)

    if (!gameStarted.current || shouldShowInstructions.current) {
      showInstructions(canvas.current!, ctx.current!, scaleRatio.current)
    }

    if (gameOver.current) {
      showGameOver(
        canvas.current!,
        ctx.current!,
        scaleRatio.current,
        gamePoints.current,
        highScore.current,
      )
    }

    if (!gameOver.current) {
      gameSpeed.current += GAME_SPEED_INCREMENT
    }

    requestAnimationFrame(gameLoop)
  }

  return <canvas id='hummingbird-game' ref={canvas}></canvas>
}
