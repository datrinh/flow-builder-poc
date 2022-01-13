import { Graphics } from 'pixi.js'
import { computed, ref, watchEffect } from 'vue'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'

interface CanvasLinkProps {
  from: string
  to: string
}

const { getNodeById } = useNodes()
const { viewport } = useCanvas()

const CanvasLink = ({ from, to }: CanvasLinkProps) => {
  const line = new Graphics()
  const fromNode = computed(() => getNodeById(from))
  const toNode = computed(() => getNodeById(to))

  const fromBounds = viewport.getChildByName(from).getBounds()
  const toBounds = viewport.getChildByName(to).getBounds()

  // Decide which border side to attach link to
  const calcPosX = () => {
    let fromX
    if (fromNode.value!.x < toNode.value!.x) {
      fromX = fromNode.value!.x + fromBounds.width / 2
    } else {
      fromX = fromNode.value!.x - fromBounds.width / 2
    }
    let toX
    if (toNode.value!.x < fromNode.value!.x) {
      toX = toNode.value!.x + toBounds.width / 2
    } else {
      toX = toNode.value!.x - toBounds.width / 2
    }
    return { fromX, toX }
  }

  watchEffect(() => {
    if (fromNode.value && toNode.value) {
      const { fromX, toX } = calcPosX()
      line.clear()
      line.lineStyle({ width: 2 })

      // Simple Line
      // line.moveTo(fromX, fromNode.value.y)
      // line.lineTo(toX, toNode.value.y)

      // Bezier
      line.moveTo(0, 0)
      line.bezierCurveTo(
        (toX - fromX) / 2,
        0,
        (toX - fromX) / 2,
        toNode.value.y - fromNode.value.y,
        toX - fromX,
        toNode.value.y - fromNode.value.y
      )
      line.x = fromX
      line.y = fromNode.value.y
    }
  })

  return line
}

export default CanvasLink
