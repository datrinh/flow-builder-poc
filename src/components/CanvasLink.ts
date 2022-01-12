import type { Viewport } from 'pixi-viewport'
import { Graphics } from 'pixi.js'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import { Position } from '../types'

interface CanvasLinkProps {
  from: { id: string } & Position
  to: { id: string } & Position
}

const graphics = new Graphics()

const CanvasLink = ({ from, to }: CanvasLinkProps, viewport: Viewport) => {
  graphics.lineStyle({ width: 2 })
  graphics.moveTo(from.x, from.y)
  graphics.lineTo(to.x, to.y)

  return graphics
}

export default CanvasLink
