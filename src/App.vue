<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import useNodes from './composables/useNodes'
import useLinks from './composables/useLinks'

const { nodes } = useNodes()
const { links, addLink } = useLinks()

const onElementClicked = (ev) => {
  console.log('el clicked', ev)
  // removeNode(ev.data.id)
}

const onDrag = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', 'new-node')
}
const onAddLink = () => {
  const [firstNode, secondNode] = nodes.value
  addLink(firstNode.id, secondNode.id)
}
</script>

<template>
  <div>
    <Canvas @element-clicked="onElementClicked"></Canvas>
    <div class="fixed top-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Nodes</h1>
      <pre>
        {{ nodes }}
      </pre>
    </div>
    <div class="fixed bottom-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Links</h1>
      <button @click="onAddLink">add</button>
      <pre>
        {{ links }}
      </pre>
    </div>

    <div
      draggable="true"
      @dragstart="onDrag"
      class="fixed bottom-0 left-4 w-60 h-60 bg-[#00FF00] shadow-xl translate-y-40 hover:translate-y-28 transition-transform"
    ></div>
  </div>
</template>
