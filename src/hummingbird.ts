export default class Hummingbird {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  scaleRatio: number
  x: number
  y: number
  image: HTMLImageElement
  upImage: HTMLImageElement
  downImage: HTMLImageElement

  GRAVITY = .02
  JUMP_SPEED = 1.8
  MAX_JUMP_HEIGHT = .9
  jumped = false
  velocity = 0

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, scaleRatio: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height
    this.scaleRatio = scaleRatio

    this.x = this.canvas.width / 5
    this.y = (this.canvas.height / 2) - (this.height / 2)
    this.upImage = new Image()
    this.upImage.src = './src/images/hummingbird.png'
    this.downImage = new Image()
    // this.downImage.src
    this.image = this.upImage

    // keybinds
    window.removeEventListener('keydown', this.keydown)
    window.addEventListener('keydown', this.keydown)
  }

  keydown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      this.jumped = true
    }
  }

  jump = () => {
    if (this.jumped) {
      this.jumped = false
      this.velocity -= this.JUMP_SPEED

      if (this.velocity < -this.MAX_JUMP_HEIGHT) {
        this.velocity = -this.MAX_JUMP_HEIGHT
      }
    }
  }

  fall = (frameDelta: number) => {
    this.velocity += this.GRAVITY
    this.y += this.velocity * frameDelta * this.scaleRatio
  }

  collide = () => {
    return (
      this.y < 0 ||
      this.y + this.height > this.canvas.height
    )
  }

  reset = () => {
    this.velocity = 0
    this.y = (this.canvas.height / 2) - (this.height / 2)
    this.jumped = false
  }

  update = (frameDelta: number) => {
    this.jump()
    this.fall(frameDelta)
  }

  draw = () => {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }


}