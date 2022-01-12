<script setup lang="ts">
import { Application } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { onMounted, ref, watch } from 'vue'
import CanvasNode from './CanvasNode'
import useNodes from '../composables/useNodes'
import useLinks from '../composables/useLinks'
import CanvasLink from './CanvasLink'
import useCanvas from '../composables/useCanvas'

const { nodes, updateNodePosition, addNode, getNodeById } = useNodes()
const { links } = useLinks()
const emit = defineEmits(['element-clicked', 'canvas-clicked', 'element-dropped', 'element-moved'])

const { viewport, init } = useCanvas()

onMounted(() => {
  const canvas = document.getElementById('canvas')!
  init(canvas)
  render()
})

const render = () => {
  nodes.value.forEach(({ x, y, id }) => {
    const node = CanvasNode({ x, y }, viewport)
    node.on('drop', (ev) => {
      updateNodePosition(id, { x: ev.x, y: ev.y })
      emit('element-moved', ev)
    })
    node.on('clicked', (ev) => {
      emit('element-clicked', ev)
    })

    viewport.addChild(node)
  })

  // links.value.forEach((link) => {
  //   const from = getNodeById(link.from)
  //   const to = getNodeById(link.to)
  //   if (from && to) {
  //     const link = CanvasLink({ from, to }, viewport)
  //     viewport.addChild(link)
  //   }
  // })
}

watch(
  [nodes, links],
  () => {
    render()
  },
  { deep: true }
)

const onDragOver = (ev: DragEvent) => {
  ev.preventDefault()
}
const onDropFromOutside = (ev: DragEvent) => {
  ev.preventDefault()
  const data = ev.dataTransfer?.getData('text/plain')
  if (data === 'new-node') {
    const { x, y } = viewport.toLocal({ x: ev.clientX, y: ev.clientY })
    addNode({ x, y })
    emit('element-dropped', { x, y })
  }
}
</script>

<template>
  <div class="fixed inset-0" @dragover="onDragOver" @drop="onDropFromOutside">
    <div id="canvas"></div>
  </div>
</template>
