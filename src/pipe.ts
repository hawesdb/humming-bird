export default class Pipe {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  x: number
  y: number
  image: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, y: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height

    this.x = this.canvas.width + this.width
    this.y = y
    this.image = new Image()
    this.image.src = './src/images/pipe.png'
    this.image.onload = () => {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
  }

  draw(gameSpeed: number) {
    this.x -= gameSpeed
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}