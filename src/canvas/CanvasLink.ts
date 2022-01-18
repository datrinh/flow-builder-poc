import { Container } from 'pixi.js'
import { v4 as uuid } from 'uuid'
import useCanvas from '../composables/useCanvas'
import { drawBezier } from '../utils/line'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

interface CanvasLinkProps {
  from: string
  to: string
  id: string
}

const { viewport } = useCanvas()

export const drawLine = (line: Graphics, { from, to }: { from: string; to: string }) => {
  const fromPort = (viewport.getChildByName(from) as Container).getChildByName('right')
  const toPort = (viewport.getChildByName(to) as Container).getChildByName('left')
  const toPortPos = viewport.toLocal(toPort.getGlobalPosition())
  const fromPortPos = viewport.toLocal(fromPort.getGlobalPosition())

  drawBezier(line, { fromX: fromPortPos.x, fromY: fromPortPos.y, toX: toPortPos.x, toY: toPortPos.y })
}

const CanvasLink = ({ from, to, id = uuid() }: CanvasLinkProps) => {
  const line = new Graphics()
  line.name = id

  drawLine(line, { from, to })

  return line
}

export default CanvasLink
