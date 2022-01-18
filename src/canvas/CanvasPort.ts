import { Container, DisplayObject, InteractionEvent } from 'pixi.js'
import { NodeModel, Position } from '../types'
import useCanvas from '../composables/useCanvas'
import { v4 as uuid } from 'uuid'
import useNodes from '../composables/useNodes'
import useLinks from '../composables/useLinks'
import { size } from '../utils/animations'
import withDragDrop from '../utils/withDragDrop'
import { drawBezier } from '../utils/line'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

interface CreatePortArgs {
  x: number
  y: number
  color?: number
  width?: number
  radius?: number
  id?: string
}

const { viewport } = useCanvas()
const { addNode } = useNodes()
const { addLink } = useLinks()

const onPortClicked = ({ x, y }: Position, from: Container) => {
  const margin = 100

  const newNode = addNode({ x: x + margin, y, data: { title: 'From Port' } })
  addLink(from.name, newNode.id)
}

const createPort = ({ x, y, radius = 5, color = 0xfff171, width = 2, id = uuid() }: CreatePortArgs) => {
  const port = new Graphics()
  port.lineStyle({ width, color })
  port.beginFill(color, 1)
  port.drawCircle(0, 0, radius)
  port.endFill()
  port.interactive = true
  port.buttonMode = true
  port.name = id
  port.x = x
  port.y = y

  port.on('pointerover', () => {
    size(port, 20, 100)
  })
  port.on('pointerout', () => {
    size(port, 10, 100)
  })

  return port
}

const CanvasPort = (parent: Container) => {
  const parentBounds = parent.getBounds()

  const leftPort = createPort({ x: 0, y: parentBounds.height / 2, id: 'left' })
  const rightPort = withDragDrop(createPort({ x: parentBounds.width, y: parentBounds.height / 2, id: 'right' }))
  // const topPort = createPort({ x: parentBounds.width / 2, y: 0, id: 'top' })
  // const bottomPort = createPort({ x: parentBounds.width / 2, y: parentBounds.height, id: 'bottom' })

  const line = new Graphics()
  rightPort.on('drag-move', (ev: InteractionEvent) => {
    const { x: fromX, y: fromY } = viewport.toLocal(rightPort.getGlobalPosition())
    const { x: toX, y: toY } = viewport.toLocal(ev.data.global)
    drawBezier(line, {
      fromX,
      fromY,
      toX,
      toY,
    })
  })
  rightPort.on('drag-start', (ev: InteractionEvent) => {
    viewport.addChild(line)
    viewport.once('pointerup', (ev) => {
      let { x, y } = viewport.toLocal(ev.data.global)
      y = y - rightPort.y
      const newNode = addNode({ x, y, data: { title: 'From Port' } })
      addLink(parent.name, newNode.id)
      viewport.removeChild(line)
    })
  })

  const render = () => {
    parent.addChild(leftPort)
    parent.addChild(rightPort)
    // parent.addChild(topPort)
    // parent.addChild(bottomPort)
  }

  return {
    leftPort,
    rightPort,
    // topPort,
    // bottomPort,
    render,
  }
}

export default CanvasPort
