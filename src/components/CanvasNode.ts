import { Sprite, Texture } from 'pixi.js'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition } = useNodes()

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const node = new Sprite(Texture.WHITE)
  node.position.set(x, y)
  node.anchor.set(0.5)
  node.width = 100
  node.height = 100
  node.tint = 0x00ff00
  node.interactive = true
  node.buttonMode = true
  node.name = id

  let isDragging = false
  let data: InteractionData | null = null

  const onDragStart = (ev: InteractionEvent) => {
    ev.stopPropagation()
    isDragging = false
    data = ev.data
  }
  const onDragEnd = (ev: InteractionEvent) => {
    const { x, y } = ev.data.getLocalPosition(viewport)
    if (isDragging) {
      // updateNodePosition(node.name, { x, y })
      node.emit('drop', { el: node, event: ev, x, y })
    } else {
      node.emit('clicked', { el: node, event: ev, x, y })
    }
    isDragging = false
    data = null
  }
  const onDragMove = () => {
    isDragging = true
    if (isDragging && data) {
      const newPosition = data.getLocalPosition(viewport)
      node.x = newPosition.x
      node.y = newPosition.y
      updateNodePosition(node.name, { x: node.x, y: node.y })
    }
  }

  node
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)

  return node
}

export default CanvasNode
