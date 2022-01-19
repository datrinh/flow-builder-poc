import { size } from '../utils/animations'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import { AdditionalProps, CanvasElementType } from '../types'

interface CreatePortArgs {
  x: number
  y: number
  color?: number
  width?: number
  radius?: number
  id: 'origin' | 'target'
}

class CanvasPort extends Graphics implements AdditionalProps {
  type: CanvasElementType = 'port'

  constructor({ x, y, radius = 5, color = 0xfff171, width = 2, id }: CreatePortArgs) {
    super()

    this.lineStyle({ width, color })
    this.beginFill(color, 1)
    this.drawCircle(0, 0, radius)
    this.endFill()
    this.interactive = true
    this.buttonMode = true
    this.name = id
    this.x = x
    this.y = y

    this.on('pointerover', () => {
      size(this, 20, 100)
    })
    this.on('pointerout', () => {
      size(this, 10, 100)
    })
  }
}

export default CanvasPort
