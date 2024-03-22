import Hummingbird from './hummingbird'
import Pencil from './pencil'
import { Collideable } from '../types'

export default class PencilController {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  scaleRatio: number
  pencilMax: number
  pencilMin: number

  PENCIL_WIDTH = 32
  PENCIL_INTERVAL = 1150
  PENCIL_GAP = 32 * 4
  PENCIL_MAX_RATIO = 3 / 4
  PENCIL_MIN_RATIO = 1 / 4
  nextPencilInterval = this.PENCIL_INTERVAL
  pencils: Pencil[] = []
  trackPassedPencils: Pencil[] = []

  constructor(ctx: CanvasRenderingContext2D, scaleRatio: number) {
    this.ctx = ctx
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.scaleRatio = scaleRatio
    this.width = this.PENCIL_WIDTH * this.scaleRatio

    this.pencilMax = (this.canvas.height * this.PENCIL_MAX_RATIO) / this.scaleRatio
    this.pencilMin = (this.canvas.height * this.PENCIL_MIN_RATIO) / this.scaleRatio
  }

  createPencil = () => {
    const pencilCenter = Math.floor(
      Math.random() * (this.pencilMax - this.pencilMin + 1) + this.pencilMin,
    )

    const x = this.canvas.width + this.width
    const topHeight = (pencilCenter - this.PENCIL_GAP / 2) * this.scaleRatio
    const bottomHeight = (pencilCenter + this.PENCIL_GAP / 2) * this.scaleRatio

    const topPencil = new Pencil(this.ctx, this.width, topHeight, x, 0)
    const bottomPencil = new Pencil(
      this.ctx,
      this.width,
      this.canvas.height - bottomHeight,
      x,
      bottomHeight,
    )

    this.pencils.push(...[topPencil, bottomPencil])
    this.trackPassedPencils.push(topPencil)
  }

  collideWith = (sprite: Collideable) => {
    return this.pencils.some((pencil) => pencil.collideWith(sprite))
  }

  hasPassed = (sprite: Hummingbird) => {
    // trackPassedPencils array is in order, check if first set of pencils are passed and remove
    // from array if they are
    if (!(sprite instanceof Hummingbird)) return false
    const spritePassedPencil =
      this.trackPassedPencils.length > 0 && this.trackPassedPencils[0].hasPassed(sprite)
    if (spritePassedPencil) this.trackPassedPencils.shift()
    return spritePassedPencil
  }

  reset = () => {
    this.pencils = []
    this.trackPassedPencils = []
  }

  update = (frameDelta: number, gameSpeed: number) => {
    if (this.nextPencilInterval <= 0) {
      this.createPencil()
      this.nextPencilInterval = this.PENCIL_INTERVAL
    }

    this.nextPencilInterval -= frameDelta

    this.pencils.forEach((pencil) => pencil.update(gameSpeed, frameDelta, this.scaleRatio))

    // cleanup pencils off the screen
    this.pencils = this.pencils.filter((pencil) => pencil.x > -pencil.width)
  }

  draw = () => {
    this.pencils.forEach((pencil) => pencil.draw())
  }
}
