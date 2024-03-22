export const showInstructions = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleRatio: number,
) => {
  const fontSize = 12 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px press_start_2p`
  ctx.fillStyle = 'darkgrey'
  const x = canvas.width / 2
  const y = canvas.height / 2 + 100
  ctx.fillText('Press space to jump', x, y)
}

export const showPointCounter = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleRatio: number,
  gamePoints: number,
) => {
  const fontSize = 25 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px press_start_2p`
  const x = canvas.width / 2
  const y = canvas.height / 6
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.strokeText(String(gamePoints), x, y)
  ctx.fillStyle = '#EEE'
  ctx.fillText(String(gamePoints), x, y)
}

export const showHighScore = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleRatio: number,
  highScore: number,
) => {
  const fontSize = 20 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px press_start_2p`
  const x = canvas.width / 2
  const y = canvas.height / 2 - 20 * scaleRatio
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.strokeText(`HI: ${highScore}`, x, y)
  ctx.fillStyle = '#EEE'
  ctx.fillText(`HI: ${highScore}`, x, y)
}

export const showGameOver = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleRatio: number,
  points: number,
  highScore: number,
) => {
  showPointCounter(canvas, ctx, scaleRatio, points)
  showHighScore(canvas, ctx, scaleRatio, highScore)
  const fontSize = 50 * scaleRatio
  ctx.textAlign = 'center'
  ctx.font = `${fontSize}px press_start_2p`
  const x = canvas.width / 2
  const y = canvas.height / 3
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.strokeText('GAME OVER', x, y)
  ctx.fillStyle = 'grey'
  ctx.fillText('GAME OVER', x, y)
}
