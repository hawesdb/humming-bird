export default class Hummingbird {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  scaleRatio: number
  x: number
  y: number
  image: HTMLImageElement
  images: HTMLImageElement[]

  GRAVITY = 0.008
  JUMP_SPEED = 1.1
  MAX_JUMP_HEIGHT = 0.4
  jumped = false
  velocity = 0

  // image control
  HUMMINGBIRD_WIDTH = 32
  HUMMINGBIRD_HEIGHT = 32
  IMAGE_SWITCH_DELAY = 6
  currentImage = 0
  imageDelay = this.IMAGE_SWITCH_DELAY

  constructor(ctx: CanvasRenderingContext2D, scaleRatio: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.scaleRatio = scaleRatio
    this.width = this.HUMMINGBIRD_WIDTH * this.scaleRatio
    this.height = this.HUMMINGBIRD_HEIGHT * this.scaleRatio

    this.x = this.canvas.width / 5
    this.y = this.canvas.height / 2 - this.height / 2
    this.images = [
      require('../assets/images/hummingbird-wings-up.png'),
      require('../assets/images/hummingbird-wings-neutral.png'),
      require('../assets/images/hummingbird-wings-down.png'),
    ].map((image) => {
      const img = new Image()
      img.src = image
      return img
    })

    this.image = this.images[this.currentImage]

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
    return this.y < 0 || this.y + this.height > this.canvas.height
  }

  reset = () => {
    this.velocity = 0
    this.y = this.canvas.height / 2 - this.height / 2
    this.jumped = false
  }

  updateImage = () => {
    this.imageDelay -= 1
    if (this.imageDelay === 0) {
      this.currentImage = this.currentImage === this.images.length - 1 ? 0 : this.currentImage + 1
      this.imageDelay = this.IMAGE_SWITCH_DELAY
    }
  }

  update = (frameDelta: number) => {
    this.updateImage()
    this.jump()
    this.fall(frameDelta)
  }

  draw = () => {
    this.ctx.drawImage(this.images[this.currentImage], this.x, this.y, this.width, this.height)
  }
}
