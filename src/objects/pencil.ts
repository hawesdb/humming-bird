import Hummingbird from './hummingbird'
import { Collideable } from '../types'

export default class Pencil {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  x: number
  y: number
  topImage: HTMLImageElement
  bodyImage: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height
    this.x = x
    this.y = y

    this.topImage = new Image()
    this.topImage.src =
      this.y === 0
        ? require('../assets/images/pencil-top-reverse.png')
        : require('../assets/images/pencil-top.png')
    this.bodyImage = new Image()
    this.bodyImage.src = require('../assets/images/pencil-body.png')
  }

  collideWith = (sprite: Collideable) => {
    return (
      // right collision
      sprite.x < this.x + this.width - 10 &&
      // left collision
      sprite.x + sprite.width - 10 > this.x &&
      // bottom collision
      sprite.y < this.y + this.height - 18 &&
      // top collision
      sprite.y + sprite.height - 10 > this.y
    )
  }

  hasPassed = (sprite: Hummingbird) => {
    // check if the hummingbird sprite has passed the pencils
    const endOfSprite = sprite.x - sprite.width / 2
    const endOfPencil = this.x + this.width / 2
    return endOfSprite > endOfPencil
  }

  update = (speed: number, frameDelta: number, scaleRatio: number) => {
    this.x -= speed * frameDelta * scaleRatio
  }

  draw = () => {
    this.ctx.drawImage(
      this.topImage,
      this.x,
      this.y === 0 ? this.height - 64 : this.y,
      this.width,
      64,
    )
    this.ctx.drawImage(
      this.bodyImage,
      this.x,
      this.y === 0 ? this.y : this.y + 64,
      this.width,
      this.height - 64,
    )
  }
}
