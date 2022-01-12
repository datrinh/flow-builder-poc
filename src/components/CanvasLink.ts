import { Graphics } from 'pixi.js'
import { computed, ref, watchEffect } from 'vue'
import useNodes from '../composables/useNodes'

interface CanvasLinkProps {
  from: string
  to: string
}

const { getNodeById } = useNodes()
const graphics = new Graphics()

const CanvasLink = ({ from, to }: CanvasLinkProps) => {
  const line = graphics
  const fromNode = computed(() => getNodeById(from))
  const toNode = computed(() => getNodeById(to))

  watchEffect(() => {
    if (fromNode.value && toNode.value) {
      line.clear()
      line.lineStyle({ width: 2 })
      line.moveTo(fromNode.value.x, fromNode.value.y)
      line.lineTo(toNode.value.x, toNode.value.y)
    }
  })

  return line
}

export default CanvasLink
