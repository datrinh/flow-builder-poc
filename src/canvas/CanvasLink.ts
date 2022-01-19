import { Container } from 'pixi.js'
import { v4 as uuid } from 'uuid'
import useCanvas from '../composables/useCanvas'
import { drawBezier } from '../utils/line'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { AdditionalProps, CanvasElementType } from '../types'

interface CanvasLinkProps {
  from: string
  to: string
  id: string
}

const { viewport } = useCanvas()

class CanvasLink extends Graphics implements AdditionalProps {
  type: CanvasElementType = 'link'
  from: string
  to: string

  constructor({ from, to, id = uuid() }: CanvasLinkProps) {
    super()
    this.name = id
    this.from = from
    this.to = to

    this.update()
  }

  private drawLine(line: Graphics, { from, to }: { from: string; to: string }) {
    const fromPort = (viewport.getChildByName(from) as Container).getChildByName('origin')
    const toPort = (viewport.getChildByName(to) as Container).getChildByName('target')
    const toPortPos = viewport.toLocal(toPort.getGlobalPosition())
    const fromPortPos = viewport.toLocal(fromPort.getGlobalPosition())

    drawBezier(line, { fromX: fromPortPos.x, fromY: fromPortPos.y, toX: toPortPos.x, toY: toPortPos.y })
  }

  public update() {
    this.drawLine(this, { from: this.from, to: this.to })
  }
}

export default CanvasLink
