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
  upImage: HTMLImageElement
  neutralImage: HTMLImageElement
  downImage: HTMLImageElement

  GRAVITY = .02
  JUMP_SPEED = 1.6
  MAX_JUMP_HEIGHT = .8
  jumped = false
  velocity = 0

  // image control
  IMAGE_SWITCH_DELAY = 6
  currentImage = 0
  imageDelay = this.IMAGE_SWITCH_DELAY

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, scaleRatio: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height
    this.scaleRatio = scaleRatio

    this.x = this.canvas.width / 5
    this.y = (this.canvas.height / 2) - (this.height / 2)
    this.upImage = new Image()
    this.upImage.src = './src/images/hummingbird-wings-up.png'
    this.neutralImage = new Image()
    this.neutralImage.src = './src/images/hummingbird-wings-neutral.png'
    this.downImage = new Image()
    this.downImage.src = './src/images/hummingbird-wings-down.png'
    this.images = [this.upImage, this.neutralImage, this.downImage]
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