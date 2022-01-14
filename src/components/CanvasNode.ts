import { Container, Sprite, Text, Texture } from 'pixi.js'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { watchEffect } from 'vue'
import CanvasPort from '../composables/CanvasPort'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const nodeModel = getNodeById(id)

  const container = new Container()
  container.name = id
  container.buttonMode = true
  container.interactive = true
  container.position.set(x, y)
  container.pivot.x = container.width / 2
  container.pivot.y = container.height / 2

  const node = new Sprite(Texture.WHITE)
  node.width = 100
  node.height = 100
  node.tint = 0x00ff00
  node.interactive = true
  node.buttonMode = true
  node.name = id
  container.addChild(node)

  const label = nodeModel?.data.title || ''
  const text = new Text(label, {
    fontSize: 16,
    fill: '#000',
    wordWrap: true,
    wordWrapWidth: node.width * (0.8 / window.devicePixelRatio),
  })
  text.x = 10
  text.y = 15
  text.resolution = 10
  container.addChild(text)

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
      container.emit('drop', { el: container, event: ev, x, y })
    } else {
      container.emit('clicked', { el: container, event: ev, x, y })
    }
    isDragging = false
    data = null
  }
  const onDragMove = () => {
    isDragging = true
    if (isDragging && data) {
      const newPosition = data.getLocalPosition(viewport)
      container.x = newPosition.x
      container.y = newPosition.y
      updateNodePosition(container.name, { x: container.x, y: container.y })
    }
  }

  container
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)

  const { render } = CanvasPort(container)
  render()

  watchEffect(() => {
    if (nodeModel) {
      container.x = nodeModel.x
      container.y = nodeModel.y
    }
  })

  return container
}

export default CanvasNode
