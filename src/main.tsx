import { useEffect, useRef } from 'react'
import { Game } from './engine/game'

export const HummingbirdGame = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const game = useRef<Game | null>(null)

  useEffect(() => {
    // upon component closure
    return (() => {
      game.current?.deregister()
    })
  })

  useEffect(() => {
    if (canvas.current && !game.current) {
      game.current = new Game(canvas)
    }
  }, [canvas])

  return <canvas id='hummingbird-game' ref={canvas} />
}
