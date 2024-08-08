import {
  Ground,
  Hummingbird,
  PencilController,
  showGameOver,
  showInstructions,
  showPointCounter,
} from '../objects'
import { Settings } from './settings'
import { debounce } from './util'

export class Level {
  canvas: React.RefObject<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D
  ground: Ground | undefined
  hummingbird: Hummingbird | undefined
  pencilController: PencilController | undefined

  GAME_WIDTH = 800
  GAME_HEIGHT = 400
  GAME_SPEED_START = 0.2
  RESTART_TIME = 2000

  gameStarted = false
  gameOver = false
  startTimer = this.RESTART_TIME
  canStart = true
  gamePoints = 0
  highScore = 0

  constructor(canvas: React.RefObject<HTMLCanvasElement>) {
    this.canvas = canvas
    this.ctx = this.canvas.current!.getContext('2d')!
    this.setup()
    window.addEventListener(
      'resize',
      debounce(() => this.setup()),
    )
    window.addEventListener('keydown', this.startGame)
  }

  setup = () => {
    this.setScreenSize()

    this.ground = new Ground(this.ctx)
    this.hummingbird = new Hummingbird(this.ctx)
    this.pencilController = new PencilController(this.ctx)
  }

  startGame = (event: KeyboardEvent) => {
    if (event.code === 'Space' && this.canStart && !this.gameStarted) {
      this.gameStarted = true
      if (this.gameOver) {
        this.gameOver = false
        this.setup()
      }
    }
  }

  getScaleRatio = () => {
    const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
    const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight)

    if (screenWidth / screenHeight < this.GAME_WIDTH / this.GAME_HEIGHT) {
      return screenWidth / this.GAME_WIDTH
    } else {
      return screenHeight / this.GAME_HEIGHT
    }
  }

  setScreenSize = () => {
    const scaleRatio = this.getScaleRatio()
    Settings.set('scaleRatio', scaleRatio)
    this.canvas.current!.width = this.GAME_WIDTH * scaleRatio
    this.canvas.current!.height = this.GAME_HEIGHT * scaleRatio
  }

  clearScreen = () => {
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.current!.width, this.canvas.current!.height)
  }

  incrementPoints = () => {
    this.pencilController &&
      this.hummingbird &&
      this.pencilController.hasPassed(this.hummingbird) &&
      (this.gamePoints += 1)
  }

  run = () => {
    this.clearScreen()
    const frameDelta = Settings.get('dt') as number
    this.startTimer -= 1000 * frameDelta
    if (this.startTimer <= 0 && !this.canStart) {
      this.startTimer = this.RESTART_TIME
      this.canStart = true
    }

    if (!this.gameStarted && this.canStart) {
      showInstructions(this.canvas.current!, this.ctx)
    }

    if (this.gameStarted && !this.gameOver) {
      this.ground?.update()
      this.hummingbird?.update()
      this.pencilController?.update(this.GAME_SPEED_START)

      this.incrementPoints()

      if (
        this.hummingbird?.collide() ||
        (this.hummingbird && this.pencilController?.collideWith(this.hummingbird))
      ) {
        this.highScore = Math.max(this.gamePoints, this.highScore)
        this.gameStarted = false
        this.gameOver = true
        this.canStart = false
      }
    }

    this.ground?.draw()
    this.hummingbird?.draw()
    this.pencilController?.draw()
    showPointCounter(this.canvas.current!, this.ctx, this.gamePoints)

    if (this.gameOver) {
      showGameOver(this.canvas.current!, this.ctx, this.gamePoints, this.highScore)
    }
  }

  deregister = () => {
    window.removeEventListener('resize', this.setScreenSize)
  }
}
