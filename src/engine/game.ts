import { Settings } from './settings'

const MS_PER_UPDATE = 16.7

export class Game {
  previousTime: number
  lag: number

  constructor(canvas: React.RefObject<HTMLCanvasElement>) {
    this.previousTime = performance.now()
    this.lag = 0

    this.run()
  }

  run = (timestamp = performance.now()) => {
    const elapsed = timestamp - this.previousTime
    this.previousTime = timestamp
    this.lag += elapsed

    // process input

    while (this.lag >= MS_PER_UPDATE) {
      // update
      this.lag -= MS_PER_UPDATE
    }

    // render(lag / MS_PER_UPDATE)

    requestAnimationFrame(this.run)
  }

  deregister = () => {}
}
