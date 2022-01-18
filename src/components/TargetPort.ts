import type { Container, InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import { v4 as uuid } from 'uuid'
import useNodes from '../composables/useNodes'
import useLinks from '../composables/useLinks'
import { size } from '../utils/animations'
import withDragDrop from '../utils/withDragDrop'
import { drawBezier } from '../utils/line'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { isWithinBounds } from '../utils/geometry'
import CanvasPort from '../canvas/CanvasPort'

const { viewport } = useCanvas()
const { addNode } = useNodes()
const { addLink } = useLinks()

const TargetPort = (parent: Container) => {
  const parentBounds = parent.getBounds()
  const x = 0
  const y = parentBounds.height / 2
  const port = withDragDrop(CanvasPort({ x, y, id: 'target' }))
  //   const shadowLine = new Graphics()

  //   const onDragMove = (ev: InteractionEvent) => {
  //     const { x: fromX, y: fromY } = viewport.toLocal(port.getGlobalPosition())
  //     const { x: toX, y: toY } = viewport.toLocal(ev.data.global)
  //     drawBezier(shadowLine, {
  //       fromX,
  //       fromY,
  //       toX,
  //       toY,
  //     })
  //   }

  //   const onDragEnd = (ev: InteractionEvent) => {
  //     let { x, y } = viewport.toLocal(ev.data.global)
  //     const existingNode = viewport.children
  //       // TODO: kinda dirty to check via class type. consider inheritance to extend pixi objects
  //       .filter((c) => c.name !== parent.name && c.constructor.name === 'Container2')
  //       .find((child) => isWithinBounds(ev.data.global, child.getBounds()))
  //     if (existingNode) {
  //       addLink(parent.name, existingNode.name)
  //     } else {
  //       y = y - port.y
  //       const newNode = addNode({ x, y, data: { title: 'From Port' } })
  //       addLink(parent.name, newNode.id)
  //     }
  //     viewport.removeChild(shadowLine)
  //   }

  //   port.on('drag-move', onDragMove)
  //   port.on('drag-start', () => {
  //     viewport.addChild(shadowLine)
  //     viewport.once('pointerup', onDragEnd)
  //   })

  return port
}

export default TargetPort
