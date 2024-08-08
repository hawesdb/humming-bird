import { Settings } from '../engine-old/settings'
import GroundImg from '../resources/images/ground.png'

export default class Ground {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  scaleRatio: number
  x: number
  y: number
  image: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.scaleRatio = Settings.get('scaleRatio') as number
    this.width = 800 * this.scaleRatio
    this.height = 50 * this.scaleRatio
    this.x = 0
    this.y = this.canvas.height - this.height

    this.image = new Image()
    this.image.src = GroundImg
  }

  draw = () => {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)

    if (this.x < -this.width) {
      this.x = 0
    }
  }

  update = () => {
    this.x -= 0.1
  }
}
