import { Container, IPointData, Renderer, Sprite, Text, Texture } from 'pixi.js'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { watchEffect } from 'vue'
import CanvasPort from '../composables/CanvasPort'
import { fadeIn } from '../animations'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport, app } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()

const createWrapper = (id: string) => {
  const node = new Graphics()
  node.beginFill(0xffffff)
  node.drawRoundedRect(0, 0, 150, 100, 16)
  node.endFill()
  node.filters = [new DropShadowFilter({ rotation: 90, blur: 1, color: 0xababab })]
  node.interactive = true
  node.buttonMode = true
  node.name = id

  node.on('pointerover', () => {
    node.lineStyle(2, 0xfff171)
    node.drawRoundedRect(0, 0, 150, 100, 16)
  })

  node.on('pointerout', () => {
    node.clear()
    node.beginFill(0xffffff)
    node.drawRoundedRect(0, 0, 150, 100, 16)
  })

  return node
}

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const nodeModel = getNodeById(id)

  const container = new Container()
  container.name = id
  container.buttonMode = true
  container.interactive = true
  container.position.set(x, y)
  container.pivot.x = container.width / 2
  container.pivot.y = container.height / 2
  container.alpha = 0
  fadeIn(container)

  const node = createWrapper(id)
  container.addChild(node)

  const label = `${nodeModel?.data.title}` || ''
  // const label = `${nodeModel?.data.title} x:${Math.floor(x)} y:${Math.floor(y)}` || ''
  const text = new Text(label, {
    fontSize: 16,
    fill: '#000',
    wordWrap: true,
    wordWrapWidth: node.width * 0.8,
  })
  text.x = 10
  text.y = 15
  text.resolution = 2
  container.addChild(text)

  let isDragging = false
  let data: InteractionData | null = null
  let dragOffset: IPointData

  const onDragStart = (ev: InteractionEvent) => {
    ev.stopPropagation()
    dragOffset = ev.data.getLocalPosition(node)
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
      container.x = newPosition.x - dragOffset.x
      container.y = newPosition.y - dragOffset.y
      updateNodePosition(container.name, { x: container.x, y: container.y })
    }
  }
  const onHover = () => {
    node.lineStyle(2, 0xababab)
  }

  container
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)
    .on('pointerover', onHover)

  const { leftPort, rightPort } = CanvasPort(container)
  rightPort.on('pointerup', () => {
    container.emit('port-clicked')
    // console.log('ev')
  })
  container.addChild(leftPort)
  container.addChild(rightPort)

  watchEffect(() => {
    if (nodeModel) {
      container.x = nodeModel.x
      container.y = nodeModel.y
    }
  })

  return container
}

export default CanvasNode
