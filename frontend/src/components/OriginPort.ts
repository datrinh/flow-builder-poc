import type { Container, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import useLinks from '../composables/useLinks'
import withDragDrop from '../utils/withDragDrop'
import { drawBezier } from '../utils/line'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { isWithinBounds } from '../utils/geometry'
import CanvasPort from '../canvas/CanvasPort'
import { CharlesCanvasElementObj } from '../types'

const { viewport } = useCanvas()
const { addNode } = useNodes()
const { addLink } = useLinks()

const OriginPort = (parent: Container) => {
  const parentBounds = parent.getBounds()
  const x = parentBounds.width
  const y = parentBounds.height / 2
  const port = withDragDrop(new CanvasPort({ x, y, id: 'origin' }))
  const shadowLine = new Graphics()

  const onDragMove = (ev: InteractionEvent) => {
    const { x: fromX, y: fromY } = viewport.toLocal(port.getGlobalPosition())
    const { x: toX, y: toY } = viewport.toLocal(ev.data.global)
    drawBezier(shadowLine, {
      fromX,
      fromY,
      toX,
      toY,
    })
  }

  const onDragEnd = (ev: InteractionEvent) => {
    let { x, y } = viewport.toLocal(ev.data.global)
    const existingNode = (viewport.children as CharlesCanvasElementObj[])
      .filter((c) => c.name !== parent.name && c.type === 'node')
      .find((child) => isWithinBounds(ev.data.global, child.getBounds()))
    if (existingNode) {
      addLink(parent.name, existingNode.name)
    } else {
      y = y - port.y
      const newNode = addNode({ x, y, data: { title: '' } })
      addLink(parent.name, newNode.id)
    }
    viewport.removeChild(shadowLine)
  }

  port.on('drag-move', onDragMove)
  port.on('drag-start', () => {
    viewport.addChild(shadowLine)
    viewport.once('pointerup', onDragEnd)
  })

  return port
}

export default OriginPort
