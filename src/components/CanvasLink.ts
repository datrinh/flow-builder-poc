import { LINE_JOIN, LINE_CAP, Container } from 'pixi.js'
import { computed, ref, render, watch, watchEffect } from 'vue'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'

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

  // Decide which border side to attach link to
  // const calcPosX = () => {
  //   let fromX
  //   if (fromNode.value!.x < toNode.value!.x) {
  //     fromX = fromNode.value!.x + fromBounds.width / 2
  //   } else {
  //     fromX = fromNode.value!.x - fromBounds.width / 2
  //   }
  //   let toX
  //   if (toNode.value!.x < fromNode.value!.x) {
  //     toX = toNode.value!.x + toBounds.width / 2
  //   } else {
  //     toX = toNode.value!.x - toBounds.width / 2
  //   }
  //   return { fromX, toX }
  // }

  const renderLine = () => {
    const fromPort = (viewport.getChildByName(from) as Container).getChildByName('right')
    const toPort = (viewport.getChildByName(to) as Container).getChildByName('left')
    const toPortPos = viewport.toLocal(toPort.getGlobalPosition())
    const fromPortPos = viewport.toLocal(fromPort.getGlobalPosition())

    line.clear()
    line.lineStyle({ width: 2, join: LINE_JOIN.ROUND, cap: LINE_CAP.ROUND })
    // 90 deg line
    // line.moveTo(0, 0)
    // line.lineTo((toPortPos.x - fromPortPos.x) / 2, 0)
    // line.lineTo((toPortPos.x - fromPortPos.x) / 2, toPortPos.y - fromPortPos.y)
    // line.lineTo(toPortPos.x - fromPortPos.x, toPortPos.y - fromPortPos.y)

    // Bezier
    line.moveTo(0, 0)
    line.bezierCurveTo(
      (toPortPos.x - fromPortPos.x) / 2,
      0,
      (toPortPos.x - fromPortPos.x) / 2,
      toPortPos.y - fromPortPos.y,
      toPortPos.x - fromPortPos.x,
      toPortPos.y - fromPortPos.y
    )
    line.x = fromPortPos.x
    line.y = fromPortPos.y
  }

  watch(
    [fromNode, toNode],
    () => {
      if (fromNode.value && toNode.value) {
        renderLine()
      }
    },
    { deep: true }
  )
  renderLine()

  return line
}

export default CanvasLink
