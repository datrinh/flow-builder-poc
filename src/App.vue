<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import useData from './composables/useNodes'
import { NodeModel, Position } from './types'
import { v4 as uuid } from 'uuid'

const { nodes } = useData()

const addNode = ({ title = 'Cool Title', x, y, id = Date.now().toString() }: NodeModel) => {
  const newNode = { title, x, y, id }
  nodes.value = [...nodes.value, newNode]
}

const removeNode = (id: string) => {
  nodes.value = nodes.value.filter((node) => node.id !== id)
}

const onElementClicked = (ev) => {
  console.log('el clicked', ev)
  // removeNode(ev.data.id)
}

const onDrag = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', 'new-node')
}
const onElementDropped = ({ x, y }: Position) => {
  addNode({ x, y, title: '', id: uuid() })
}
const onElementMoved = (ev) => {
  console.log('el moved', ev)
}
</script>

<template>
  <div>
    <Canvas
      @element-dropped="onElementDropped"
      @element-clicked="onElementClicked"
      @element-moved="onElementMoved"
    ></Canvas>
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
