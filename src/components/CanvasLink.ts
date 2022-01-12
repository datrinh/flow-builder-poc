import { Graphics } from 'pixi.js'
import type { InteractionData, InteractionEvent } from 'pixi.js'
import { Position } from '../types'
import { computed, ref, watch, watchEffect } from 'vue'
import useNodes from '../composables/useNodes'

interface CanvasLinkProps {
  from: string
  to: string
}

const { getNodeById } = useNodes()
const graphics = new Graphics()

const CanvasLink = ({ from, to }: CanvasLinkProps) => {
  const fromNode = computed(() => getNodeById(from))
  const toNode = computed(() => getNodeById(to))
  // const toNode = computed(() => getNodeById(to))
  // const line = computed(() => {
  //   if (fromNode.value && toNode.value) {
  //     console.log('fromNode.value', fromNode.value)
  //     console.log('toNode.value', toNode.value)
  // graphics.lineStyle({ width: 2 })
  // graphics.moveTo(fromNode.value.x, fromNode.value.y)
  // graphics.lineTo(toNode.value.x, toNode.value.y)

  //     return graphics
  //   }
  // })
  const line = ref<Graphics>(graphics)
  watchEffect(() => {
    if (line.value && fromNode.value && toNode.value) {
      graphics.clear()
      graphics.lineStyle({ width: 2 })
      graphics.moveTo(fromNode.value.x, fromNode.value.y)
      graphics.lineTo(toNode.value.x, toNode.value.y)

      line.value = graphics
      // line.value.x = fromNode.value.x
      // line.value.y = fromNode.value.y
    }
  })

  return line
}

export default CanvasLink
