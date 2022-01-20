import { LINE_CAP, LINE_JOIN } from 'pixi.js'
import type { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

interface DrawLineVars {
  fromX: number
  fromY: number
  toX: number
  toY: number
}

const threshold = 50
export const drawBezier = (line: Graphics, { fromX, fromY, toX, toY }: DrawLineVars) => {
  let offset = 0
  // target is to the left
  if (fromX - toX > -threshold) {
    offset = fromX - toX + threshold
  }

  line.clear()
  line.lineStyle({ width: 2, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND })
  line.moveTo(0, 0)
  line.bezierCurveTo((toX - fromX) / 2 + offset, 0, (toX - fromX) / 2 - offset, toY - fromY, toX - fromX, toY - fromY)
  line.x = fromX
  line.y = fromY
}

export const drawLineRect = (line: Graphics, { fromX, fromY, toX, toY }: DrawLineVars) => {
  line.clear()
  line.lineStyle({ width: 2, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND })
  line.moveTo(0, 0)
  line.lineTo((toX - fromX) / 2, 0)
  line.lineTo((toX - fromX) / 2, toY - fromY)
  line.lineTo(toX - fromX, toY - fromY)
  line.x = fromX
  line.y = fromY
}
