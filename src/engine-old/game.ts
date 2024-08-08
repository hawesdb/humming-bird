import { Level } from './level'
import { Settings } from './settings'

export class Game {
  level: Level
  previousTime: number

  constructor(canvas: React.RefObject<HTMLCanvasElement>) {
    this.level = new Level(canvas)
    this.previousTime = Date.now()

    this.run()
  }

  run = (timestamp = performance.now()) => {
    Settings.set('dt', timestamp - this.previousTime)
    this.previousTime = timestamp

    this.level.run()

    requestAnimationFrame(this.run)
  }

  deregister = () => {
    this.level.deregister()
  }
}
