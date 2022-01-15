import { useStorage } from '@vueuse/core'
import { Container, DisplayObject, Graphics, InteractionEvent } from 'pixi.js'
import { computed } from 'vue'
import { NodeModel } from '../types'
import useCanvas from './useCanvas'
import { v4 as uuid } from 'uuid'

interface Port {
  title?: string
  id: string
}

interface CreatePortArgs {
  x: number
  y: number
  color?: number
  width?: number
  radius?: number
  id?: string
}

// const ports = useStorage<Port[]>('ports', [])
// const { viewport } = useCanvas()

const startLink = () => {
  // const line = new Graphics()
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

  // port.on('pointerup', (ev: InteractionEvent) => {
  //   startLink()
  //   console.log('ev', ev)
  // })

  return port
}

const CanvasPort = (parent: Container) => {
  const parentBounds = parent.getBounds()

  const leftPort = createPort({ x: 0, y: parentBounds.height / 2, id: 'left' })
  const rightPort = createPort({ x: parentBounds.width, y: parentBounds.height / 2, id: 'right' })
  // const topPort = createPort({ x: parentBounds.width / 2, y: 0, id: 'top' })
  // const bottomPort = createPort({ x: parentBounds.width / 2, y: parentBounds.height, id: 'bottom' })

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
