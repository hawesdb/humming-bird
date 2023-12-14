import Hummingbird from './hummingbird'
import Pipe from './pipe'
import './style.scss'

let startTime: number | null = null
let activeGame: boolean = false
let lostGame: boolean = false

// screen
const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

const startMessage: HTMLElement = document.getElementById('game-start-message')!
const lostMessage: HTMLElement = document.getElementById('game-lose-message')!

// physics
const GRAVITY = .1
const JUMP_HEIGHT = 10
const PIPE_MAX_RATIO = 3 / 4
const PIPE_MIN_RATIO = 1 / 4
let pipeGap = 100
let pipeMax = canvas.height * PIPE_MAX_RATIO
let pipeMin = canvas.height * PIPE_MIN_RATIO
let velocity = 0
let gameSpeed = 3
let pipeInterval = 1500

// game objects
let hummingbird: Hummingbird | null = null
let pipes: Pipe[] = []
let pipesToDelete: number[] = []


const setScreen = () => {
  canvas.width = Math.min(window.innerWidth, canvas.parentElement?.clientWidth ?? 0)
  canvas.height = Math.min(window.innerHeight, canvas.parentElement?.clientHeight ?? 0)
  pipeMax = canvas.height * PIPE_MAX_RATIO
  pipeMin = canvas.height * PIPE_MIN_RATIO
  createInitialSprites()
}

const createInitialSprites = () => {
  startTime = null
  velocity = 0
  hummingbird = new Hummingbird(ctx, 60, 60)
  pipes = []
  pipeGap = hummingbird.height * 4
}

const clearScreen = () => {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas?.clientWidth, canvas?.clientHeight)
}

// LISTENERS
window.addEventListener('resize', setScreen)
window.addEventListener('keydown', (event) => {
  if (event.key == ' ') {
    if (activeGame) {
      velocity -= JUMP_HEIGHT
      if (velocity < -7) {
        velocity = -7
      }
    } else {
      createInitialSprites()
      activeGame = true
      lostGame = false
      startMessage.classList.add('active-game-hide')
      lostMessage.classList.add('active-game-hide')
      requestAnimationFrame(gameLoop)
    }
  }
})

// GAME LOOP
// This is what repeats every frame and controls frame to frame interactions
const gameLoop = (currentTime: number) => {
  clearScreen()

  if (startTime === null) {
    startTime = currentTime
  }

  if (hummingbird) {
    // if there is not an active game, then make the velocity 0
    velocity = activeGame ? velocity + GRAVITY : 0
    hummingbird.draw(velocity)

    // hit the top or bottom of the screen
    if (hummingbird.y < 0 || hummingbird.y + hummingbird.height > canvas.height) {
      activeGame = false
      lostGame = true
    }

    // hit pipes
  }

  // GENERATE THE PIPES
  if ((Math.floor(currentTime) - Math.floor(startTime)) % pipeInterval === 0) {
    const pipeCenter = Math.floor(Math.random() * (pipeMax - pipeMin + 1) + pipeMin)
    pipes.push(new Pipe(ctx, 64, pipeCenter - (pipeGap / 2), 0))
    pipes.push(new Pipe(ctx, 64, canvas.height - pipeCenter + (pipeGap / 2), pipeCenter + (pipeGap / 2)))
  }

  pipes.forEach((pipe) => {
    pipe.draw(gameSpeed)
  })

  // pipe cleanup
  pipes = pipes.filter(pipe => pipe.x > -pipe.width + 20)

  // LOST THE GAME
  // if the player has lost the game, then stop the animation cycles
  // to prevent resource waste. Also then display the relevant messages
  if (!lostGame) {
    requestAnimationFrame(gameLoop)
  } else {
    if (!lostMessage.classList.contains('lost-game-show')) {
      lostMessage.classList.add('lost-game-show')
    }

    Array.from(document.querySelectorAll('.active-game-hide')).forEach(elem => {
      elem.classList.remove('active-game-hide')
    })
  }
}

setScreen()