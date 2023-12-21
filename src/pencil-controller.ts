import Hummingbird from './hummingbird'
import Pencil from './pencil'
import { Collideable } from './types'

export default class PencilController {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  scaleRatio: number
  speed: number
  pencilMax: number
  pencilMin: number

  PENCIL_INTERVAL = 1150
  PENCIL_GAP = 64 * 4
  PENCIL_MAX_RATIO = 3 / 4
  PENCIL_MIN_RATIO = 1 / 4
  nextPencilInterval = this.PENCIL_INTERVAL
  pencils: Pencil[] = []
  trackPassedPencils: Pencil[] = []

  constructor(ctx: CanvasRenderingContext2D, width: number, scaleRatio: number, speed: number) {
    this.ctx = ctx
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.scaleRatio = scaleRatio
    this.speed = speed

    this.pencilMax = this.canvas.height * this.PENCIL_MAX_RATIO
    this.pencilMin = this.canvas.height * this.PENCIL_MIN_RATIO
  }

  createPencil = () => {
    const pencilCenter = Math.floor(Math.random() * (this.pencilMax - this.pencilMin + 1) + this.pencilMin)

    const x = this.canvas.width + this.width
    const topHeight = pencilCenter - (this.PENCIL_GAP / 2)
    const bottomHeight = pencilCenter + (this.PENCIL_GAP / 2)

    const topPencil = new Pencil(this.ctx, this.width, topHeight, x, 0)
    const bottomPencil = new Pencil(this.ctx, this.width, this.canvas.height - bottomHeight, x, bottomHeight)

    this.pencils.push(...[topPencil, bottomPencil])
    this.trackPassedPencils.push(topPencil)
  }

  collideWith = (sprite: Collideable) => {
    return this.pencils.some(pencil => pencil.collideWith(sprite))
  }

  hasPassed = (sprite: Hummingbird) => {
    // trackPassedPencils array is in order, check if first set of pencils are passed and remove
    // from array if they are
    if (!(sprite instanceof Hummingbird)) return false
    const spritePassedPencil = this.trackPassedPencils.length > 0 && this.trackPassedPencils[0].hasPassed(sprite)
    if (spritePassedPencil) this.trackPassedPencils.shift()
    return spritePassedPencil
  }

  reset = () => {
    this.pencils = []
    this.trackPassedPencils = []
  }

  update = (frameDelta: number) => {
    if (this.nextPencilInterval <= 0) {
      this.createPencil()
      this.nextPencilInterval = this.PENCIL_INTERVAL
    }

    this.nextPencilInterval -= frameDelta

    this.pencils.forEach(pencil => pencil.update(this.speed, frameDelta, this.scaleRatio))

    // cleanup pencils off the screen
    this.pencils = this.pencils.filter(pencil => pencil.x > -pencil.width)
  }

  draw = () => {
    this.pencils.forEach(pencil => pencil.draw())
  }
}