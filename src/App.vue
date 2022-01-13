<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import useNodes from './composables/useNodes'
import useLinks from './composables/useLinks'
import useCanvas from './composables/useCanvas'
import { Position } from './types'

const { nodes, addNode } = useNodes()
const { links, addLink } = useLinks()
const { viewport } = useCanvas()

// const onElementClicked = (ev) => {
//   console.log('el clicked', ev)
//   // removeNode(ev.data.id)
// }

const createMocks = () => {
  for (let i = 0; i <= 50; i++) {
    const x = Math.random() * 1000
    const y = Math.random() * 1000
    addNode({ x, y, data: { title: 'Test Title' } })
  }
  nodes.value.forEach(node => {
    const rndLinkIndex = Math.floor(Math.random() * nodes.value.length)
    addLink(node.id, nodes.value?.[rndLinkIndex].id)
  })
}

const reset = () => {
  nodes.value = []
  links.value = []
  viewport.removeChildren()
}

const onDragCard = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', 'new-node')
}
const onCardDropped = ({ x, y }: Position) => {
  addNode({ x, y, data: { title: 'Test Title' } })
}
const onAddLink = () => {
  const [firstNode, secondNode, third] = nodes.value
  addLink(firstNode.id, secondNode.id)
  addLink(secondNode.id, third.id)
  addLink(firstNode.id, third.id)
}
</script>

<template>
  <div>
    <Canvas @element-dropped="onCardDropped"></Canvas>
    <div class="fixed top-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Nodes ({{ nodes.length }})</h1>
      <button @click="createMocks" class="border p-1">Generate Random Nodes</button>
      <button @click="reset" class="border p-1">Reset</button>
      <pre>
        {{ nodes }}
      </pre>
    </div>
    <div class="fixed bottom-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Links ({{ links.length }})</h1>
      <!-- <button @click="onAddLink" class="border p-1">add</button> -->
      <pre>
        {{ links }}
      </pre>
    </div>

    <div
      draggable="true"
      @dragstart="onDragCard"
      class="fixed bottom-0 left-4 w-60 h-60 bg-[#00FF00] shadow-xl translate-y-40 hover:translate-y-28 transition-transform"
    ></div>
  </div>
</template>
