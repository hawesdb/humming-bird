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

  run = () => {
    let newTime = Date.now()
    Settings.set('dt', (newTime - this.previousTime) / 1000)
    this.previousTime = newTime

    this.level.run()

    requestAnimationFrame(this.run)
  }

  deregister = () => {
    this.level.deregister()
  }
}
