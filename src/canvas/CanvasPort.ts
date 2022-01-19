import { size } from '../utils/animations'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

interface CreatePortArgs {
  x: number
  y: number
  color?: number
  width?: number
  radius?: number
  id?: 'origin' | 'target'
}

const CanvasPort = ({ x, y, radius = 5, color = 0xfff171, width = 2, id }: CreatePortArgs) => {
  const port = new Graphics()
  port.lineStyle({ width, color })
  port.beginFill(color, 1)
  port.drawCircle(0, 0, radius)
  port.endFill()
  port.interactive = true
  port.buttonMode = true
  port.name = id || ''
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

export default CanvasPort
