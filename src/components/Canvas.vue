<script setup lang="ts">
import { onMounted, watch } from 'vue'
import CanvasNode from './CanvasNode'
import useNodes from '../composables/useNodes'
import useLinks from '../composables/useLinks'
import CanvasLink from './CanvasLink'
import useCanvas from '../composables/useCanvas'

const { nodes, addNode, getNodeById } = useNodes()
const { links } = useLinks()
const emit = defineEmits(['element-clicked', 'element-dropped'])

const { viewport, init } = useCanvas()

onMounted(() => {
  const canvas = document.getElementById('canvas')!
  init(canvas)
  renderInitial()
  listenToNodes()
})

const listenToNodes = () => {
  viewport.children.forEach(child => {
    child.removeListener('clicked-wrapper')
    child.on('clicked-wrapper', (ev) => {
      emit('element-clicked', ev)
    })
  })
}

watch(nodes, () => {
  listenToNodes()
})

const renderInitial = () => {
  nodes.value.forEach(({ x, y, id }) => {
    const node = CanvasNode({ x, y, id })
    // node.on('port-clicked', onPortClicked)
    viewport.addChild(node)
  })
  links.value.forEach((link) => {
    const newLink = CanvasLink({ from: link.from, to: link.to, id: link.id })
    viewport.addChild(newLink)
  })
}

const onDragOver = (ev: DragEvent) => {
  ev.preventDefault()
}
const onDropFromOutside = (ev: DragEvent) => {
  ev.preventDefault()
  const data = ev.dataTransfer?.getData('text/plain')
  if (data === 'new-node') {
    const { x, y } = viewport.toLocal({ x: ev.clientX, y: ev.clientY })
    emit('element-dropped', { x, y })
  }
}
</script>

<template>
  <div class="fixed inset-0" @dragover="onDragOver" @drop="onDropFromOutside">
    <div id="canvas"></div>
  </div>
</template>
