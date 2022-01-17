import { Container, IPointData, Renderer, Sprite, Text, Texture } from 'pixi.js'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { watchEffect } from 'vue'
import CanvasPort from '../composables/CanvasPort'
import { fadeIn } from '../animations'
import enhanceDragDrop from '../composables/enhanceDragDrop'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()

const createWrapper = (id: string) => {
  const wrapper = new Graphics()
  wrapper.beginFill(0xffffff)
  wrapper.drawRoundedRect(0, 0, 150, 100, 16)
  wrapper.endFill()
  wrapper.filters = [new DropShadowFilter({ rotation: 90, blur: 1, color: 0xababab })]
  wrapper.interactive = true
  wrapper.buttonMode = true
  wrapper.name = id

  wrapper.on('pointerover', () => {
    wrapper.lineStyle(2, 0xfff171)
    wrapper.drawRoundedRect(0, 0, 150, 100, 16)
  })

  wrapper.on('pointerout', () => {
    wrapper.clear()
    wrapper.beginFill(0xffffff)
    wrapper.drawRoundedRect(0, 0, 150, 100, 16)
  })

  return wrapper
}

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const nodeModel = getNodeById(id)

  const container = enhanceDragDrop(new Container())
  container.name = id
  container.buttonMode = true
  container.interactive = true
  container.position.set(x, y)
  container.pivot.x = container.width / 2
  container.pivot.y = container.height / 2
  container.alpha = 0
  fadeIn(container)

  const wrapper = createWrapper(id)
  container.addChild(wrapper)

  const label = `${nodeModel?.data.title}` || ''
  // const label = `${nodeModel?.data.title} x:${Math.floor(x)} y:${Math.floor(y)}` || ''
  const text = new Text(label, {
    fontSize: 16,
    fill: '#000',
    wordWrap: true,
    wordWrapWidth: wrapper.width * 0.8,
  })
  text.x = 10
  text.y = 15
  text.resolution = 2
  container.addChild(text)

  // let isDragging = false
  // let data: InteractionData | null = null
  // let dragOffset: IPointData

  // const onDragStart = (ev: InteractionEvent) => {
  //   ev.stopPropagation()
  // dragOffset = ev.data.getLocalPosition(container)
  //   isDragging = false
  //   data = ev.data

  //   container.on('pointermove', onDragMove)
  // }
  // const onDragEnd = (ev: InteractionEvent) => {
  //   const { x, y } = ev.data.getLocalPosition(viewport)
  //   if (isDragging) {
  //     container.emit('drop', { el: container, event: ev, x, y })
  //   } else {
  //     container.emit('clicked', { el: container, event: ev, x, y })
  //   }
  //   isDragging = false
  //   data = null
  // }
  const onDragMove = () => {
    // isDragging = true
    // if (isDragging && data) {
    // const newPosition = data.getLocalPosition(viewport)
    // container.x = newPosition.x - dragOffset.x
    // container.y = newPosition.y - dragOffset.y
    // updateNodePosition(container.name, { x: container.x, y: container.y })
    // }
  }
  const onHover = () => {
    wrapper.lineStyle(2, 0xababab)
  }

  container
    .on('drag-end', (ev) => {
      updateNodePosition(container.name, { x: container.x, y: container.y })
    })
    .on('clicked', (ev) => {
      console.log('clicked', ev)
    })
    .on('drag-move', (ev, offset) => {
      const newPosition = ev.data.getLocalPosition(viewport)
      container.x = newPosition.x - offset.x
      container.y = newPosition.y - offset.y
    })
    // .on('pointerdown', onDragStart)
    // .on('pointerup', onDragEnd)
    // .on('pointerupoutside', onDragEnd)
    // .on('pointermove', onDragMove)
    .on('pointerover', onHover)

  const { leftPort, rightPort } = CanvasPort(container)
  // rightPort.on('pointerup', () => {
  //   container.emit('port-clicked')
  //   // console.log('ev')
  // })
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
