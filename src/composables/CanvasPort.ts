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
  const line = new Graphics()
}

const createPort = ({ x, y, radius = 5, color = 0xff0000, width = 2, id = uuid() }: CreatePortArgs) => {
  const port = new Graphics()
  port.lineStyle({ width, color })
  port.beginFill(color, 1)
  port.drawCircle(x, y, radius)
  port.endFill()
  port.interactive = true
  port.buttonMode = true
  port.name = id

  port.on('pointerup', (ev: InteractionEvent) => {
    startLink()
    console.log('ev', ev)
  })

  return port
}

const CanvasPort = (parent: Container) => {
  const parentBounds = parent.getBounds()

  const leftPort = createPort({ x: 0, y: parentBounds.height / 2 })
  const rightPort = createPort({ x: parentBounds.width, y: parentBounds.height / 2 })
  const topPort = createPort({ x: parentBounds.width / 2, y: 0 })
  const bottomPort = createPort({ x: parentBounds.width / 2, y: parentBounds.height })

  const render = () => {
    parent.addChild(leftPort)
    parent.addChild(rightPort)
    parent.addChild(topPort)
    parent.addChild(bottomPort)
  }

  return {
    leftPort,
    rightPort,
    topPort,
    bottomPort,
    render,
  }
}

export default CanvasPort
