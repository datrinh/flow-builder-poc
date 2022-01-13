import { Sprite, Text, Texture } from 'pixi.js'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { watchEffect } from 'vue'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const nodeModel = getNodeById(id)
  const node = new Sprite(Texture.WHITE)
  node.position.set(x, y)
  node.anchor.set(0.5)
  node.width = 100
  node.height = 100
  node.tint = 0x00ff00
  node.interactive = true
  node.buttonMode = true
  node.name = id

  const label = nodeModel?.data.title || ''
  const text = new Text(label, {
    fontSize: 3,
    fill: '#000',
    // breakWords: true,
    wordWrap: true,
    wordWrapWidth: node.width * (0.8 / window.devicePixelRatio),
  })
  text.anchor.set(0.5, 1)
  text.resolution = 6
  node.addChild(text)

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

  watchEffect(() => {
    if (nodeModel) {
      node.x = nodeModel.x
      node.y = nodeModel.y
    }
  })

  return node
}

export default CanvasNode
