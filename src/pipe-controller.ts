import Pipe from './pipe'
import { Collideable } from './types'

export default class PipeController {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  scaleRatio: number
  speed: number
  pipeMax: number
  pipeMin: number

  PIPE_INTERVAL = 1150
  PIPE_GAP = 64 * 4
  PIPE_MAX_RATIO = 3 / 4
  PIPE_MIN_RATIO = 1 / 4
  nextPipeInterval = this.PIPE_INTERVAL
  pipes: Pipe[] = []

  constructor(ctx: CanvasRenderingContext2D, width: number, scaleRatio: number, speed: number) {
    this.ctx = ctx
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.scaleRatio = scaleRatio
    this.speed = speed

    this.pipeMax = this.canvas.height * this.PIPE_MAX_RATIO
    this.pipeMin = this.canvas.height * this.PIPE_MIN_RATIO
  }

  createPipe = () => {
    const pipeCenter = Math.floor(Math.random() * (this.pipeMax - this.pipeMin + 1) + this.pipeMin)

    const x = this.canvas.width + this.width
    const topHeight = pipeCenter - (this.PIPE_GAP / 2)
    const bottomHeight = pipeCenter + (this.PIPE_GAP / 2)

    const topPipe = new Pipe(this.ctx, this.width, topHeight, x, 0)
    const bottomPipe = new Pipe(this.ctx, this.width, this.canvas.height - bottomHeight, x, bottomHeight)

    this.pipes.push(...[topPipe, bottomPipe])
  }

  collideWith = (sprite: Collideable) => {
    return this.pipes.some(pipe => pipe.collideWith(sprite))
  }

  reset = () => {
    this.pipes = []
  }

  update = (frameDelta: number) => {
    if (this.nextPipeInterval <= 0) {
      this.createPipe()
      this.nextPipeInterval = this.PIPE_INTERVAL
    }

    this.nextPipeInterval -= frameDelta

    this.pipes.forEach(pipe => pipe.update(this.speed, frameDelta, this.scaleRatio))

    // cleanup pipes off the screen
    this.pipes = this.pipes.filter(pipe => pipe.x > -pipe.width)
  }

  draw = () => {
    this.pipes.forEach(pipe => pipe.draw())
  }
}