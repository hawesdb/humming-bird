export default class Hummingbird {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  x: number
  y: number
  image: HTMLImageElement
  upImage: HTMLImageElement
  downImage: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height

    this.x = window.innerWidth / 5
    this.y = (this.canvas.height / 2) - (this.height / 2)
    this.upImage = new Image()
    this.upImage.src = './src/images/hummingbird.png'
    this.downImage = new Image()
    // this.downImage.src
    this.image = this.upImage
    this.image.onload = () => {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
  }

  draw(velocity: number) {
    this.y += velocity
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}