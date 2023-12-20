import { Collideable } from './types'

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
    this.topImage.src = this.y == 0 ? './src/images/pencil-top-reverse.png' : './src/images/pencil-top.png'
    this.bodyImage = new Image()
    this.bodyImage.src = './src/images/pencil-body.png'
  }

  hasPassed = (sprite: Collideable) => {
    // check if sprite has passed pencil
    const endOfSprite = sprite.x - (sprite.width / 2)
    const endOfPencil = this.x + (this.width / 2)
    return endOfSprite > endOfPencil
  }

  collideWith = (sprite: Collideable) => {
    return (
      // right collision
      sprite.x < this.x + this.width - 4 &&
      // left collision
      sprite.x + sprite.width - 4 > this.x &&
      // bottom collision
      sprite.y < this.y + this.height - 4 &&
      // top collision
      sprite.y + sprite.height - 4 > this.y
    )
  }

  update = (speed: number, frameDelta: number, scaleRatio: number) => {
    this.x -= speed * frameDelta * scaleRatio
  }

  draw = () => {
    this.ctx.drawImage(this.topImage, this.x, this.y == 0 ? this.height - 64 : this.y, this.width, 64)
    this.ctx.drawImage(this.bodyImage, this.x, this.y == 0 ? this.y : this.y + 64, this.width, this.height - 64)
  }
}

// export default class Pencil {
//   ctx: CanvasRenderingContext2D
//   canvas: HTMLCanvasElement
//   width: number
//   height: number
//   scaleRatio: number
//   x: number
//   y: number
//   speed: number
//   image: HTMLImageElement

//   PIPE_GAP = 100
//   PIPE_MAX_RATIO = 3 / 4
//   PIPE_MIN_RATIO = 1 / 4

//   constructor(ctx: CanvasRenderingContext2D, width: number, height: number, y: number, scaleRatio: number, speed: number) {
//     this.ctx = ctx
//     this.canvas = ctx.canvas
//     this.width = width
//     this.height = height
//     this.scaleRatio = scaleRatio

//     this.x = this.canvas.width + this.width
//     this.y = y
//     this.speed = speed
//     this.image = new Image()
//     this.image.src = './src/images/pencil.png'
//     this.image.onload = () => {
//       this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
//     }
//   }



//   update = (gameSpeed: number, frameDelta: number) => {
//     this.x -= gameSpeed * frameDelta * this.speed
//   }

//   draw = (gameSpeed: number) => {
//     this.x -= gameSpeed
//     this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
//   }
// }