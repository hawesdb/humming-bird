import { Collideable } from './types'

export default class Pipe {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
  x: number
  y: number
  image: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, x: number, y: number) {
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.width = width
    this.height = height
    this.x = x
    this.y = y

    this.image = new Image()
    this.image.src = './src/images/pipe.png'
  }

  collideWith = (sprite: Collideable) => {
    const adjustBy = 1.05
    return (
      // right collision
      sprite.x < this.x + this.width / adjustBy &&
      // left collision
      sprite.x + sprite.width / adjustBy > this.x &&
      // bottom collision
      sprite.y < this.y + this.height / adjustBy &&
      // top collision
      sprite.y + sprite.height / adjustBy > this.y
    )
  }

  update = (speed: number, frameDelta: number, scaleRatio: number) => {
    this.x -= speed * frameDelta * scaleRatio
  }

  draw = () => {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

// export default class Pipe {
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
//     this.image.src = './src/images/pipe.png'
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