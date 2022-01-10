<script setup lang="ts">
import { ref } from 'vue'
import Canvas from './components/Canvas.vue'
import useData from './composables/useData'
import { NodeModel, Position } from './types'

const title = ref('')
const { nodes } = useData()

const addNode = ({ title = 'Cool Title', x, y, id = Date.now().toString() }: NodeModel) => {
  const newNode = { title, x, y, id }
  nodes.value = [...nodes.value, newNode]
}

const onSubmit = () => {
  addNode({ title: title.value, id: Date.now().toString(), x: 200, y: 0 })
}

const removeNode = (id: string) => {
  nodes.value = nodes.value.filter((node) => node.id !== id)
}

const onElementClicked = (ev) => {
  console.log('ev', ev)
  removeNode(ev.data.id)
}

const onCanvasClicked = (ev) => {
  // const { x, y } = ev
  // const newNode = { title: 'randon', id: '', x, y }
  // addNode(newNode)
}

const onDrag = (ev: DragEvent) => {
  ev.dataTransfer!.setData('text/plain', 'new-node')
}
const onElementDropped = ({x, y}: Position) => {
  addNode({ x, y, title: '', id: Date.now().toString() })
};
</script>

<template>
  <div>
    <Canvas @element-dropped="onElementDropped" :nodes="nodes" @element-clicked="onElementClicked" @canvas-clicked="onCanvasClicked"></Canvas>
    <div class="fixed top-4 right-4 h-[50vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Widget</h1>
      <!-- <form @submit.prevent="onSubmit">
        <input type="text" v-model="title" class="border" />
        <button type="submit">Add</button>
      </form> -->

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
