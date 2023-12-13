import Hummingbird from './hummingbird'
import './style.css'

// screen
const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

// physics
const gravity = .1
const jumpHeight = 10
let velocity = 0

// game objects
let hummingbird: Hummingbird | null = null

const setScreen = () => {
  canvas.width = Math.min(window.innerWidth, document.documentElement.clientWidth)
  canvas.height = Math.min(window.innerHeight, document.documentElement.clientHeight)
  createSprites()
}

const createSprites = () => {
  hummingbird = new Hummingbird(ctx, 60, 60)
}

const clearScreen = () => {
  console.log('== ctx ==', ctx)
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas?.clientWidth, canvas?.clientHeight)
}

// listeners
window.addEventListener('resize', setScreen)
window.addEventListener('keydown', (event) => {
  if (event.key == 'ArrowUp') {
    velocity -= jumpHeight
    if (velocity < -7) {
      velocity = -7
    }
    // velocity -= Math.min(velocity + jumpHeight, velocity + 10)
  }
})


const gameLoop = (currentTime: number) => {
  clearScreen()

  if (hummingbird) {
    velocity += gravity
    console.log(velocity)
    hummingbird.draw(velocity)
  }
  console.log(currentTime)
  requestAnimationFrame(gameLoop)
}

setScreen()
requestAnimationFrame(gameLoop)