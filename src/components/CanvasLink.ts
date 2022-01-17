import { LINE_JOIN, LINE_CAP, Container } from 'pixi.js'
import { v4 as uuid } from 'uuid'
import useCanvas from '../composables/useCanvas'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

interface CanvasLinkProps {
  from: string
  to: string
  id: string
}

const { viewport } = useCanvas()

export const renderLine = (line: Graphics, { from, to }: { from: string; to: string }) => {
  const fromPort = (viewport.getChildByName(from) as Container).getChildByName('right')
  const toPort = (viewport.getChildByName(to) as Container).getChildByName('left')
  const toPortPos = viewport.toLocal(toPort.getGlobalPosition())
  const fromPortPos = viewport.toLocal(fromPort.getGlobalPosition())

  line.clear()
  line.lineStyle({ width: 2, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND })
  // 90 deg line
  // line.moveTo(0, 0)
  // line.lineTo((toPortPos.x - fromPortPos.x) / 2, 0)
  // line.lineTo((toPortPos.x - fromPortPos.x) / 2, toPortPos.y - fromPortPos.y)
  // line.lineTo(toPortPos.x - fromPortPos.x, toPortPos.y - fromPortPos.y)

  // Bezier
  line.moveTo(0, 0)
  line.bezierCurveTo(
    (toPortPos.x - fromPortPos.x) / 2,
    0,
    (toPortPos.x - fromPortPos.x) / 2,
    toPortPos.y - fromPortPos.y,
    toPortPos.x - fromPortPos.x,
    toPortPos.y - fromPortPos.y
  )
  line.x = fromPortPos.x
  line.y = fromPortPos.y
}

const CanvasLink = ({ from, to, id = uuid() }: CanvasLinkProps) => {
  const line = new Graphics()
  line.name = id

  renderLine(line, { from, to })

  return line
}

export default CanvasLink
