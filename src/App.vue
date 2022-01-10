<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import useData from './composables/useNodes'

const { nodes } = useData()

const onElementClicked = (ev) => {
  console.log('el clicked', ev)
  // removeNode(ev.data.id)
}

const onDrag = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', 'new-node')
}
</script>

<template>
  <div>
    <Canvas @element-clicked="onElementClicked"></Canvas>
    <div class="fixed top-4 right-4 h-[50vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Widget</h1>
      <pre>
        {{ nodes }}
      </pre>
    </div>

    <div
      draggable="true"
      @dragstart="onDrag"
      class="fixed bottom-0 left-4 w-60 h-60 bg-[#00FF00] shadow-xl translate-y-40 hover:translate-y-28 transition-transform"
    ></div>
  </div>
</template>
