<script setup lang="ts">
import { ref } from 'vue'
import {useStorage} from '@vueuse/core'
import Canvas from './components/Canvas.vue'

const title = ref('')

const dataModel = useStorage('data', {
  nodes: [
    {
      id: 'node1',
      title: 'Node 1',
      x: 0,
      y: 0,
    },
    {
      id: 'node2',
      title: 'Node 2',
      x: 100,
      y: 0,
    },
  ],
  links: [
    {
      from: 'node1',
      to: 'node2',
    },
  ],
})

const addNode = (node) => {
  dataModel.value.nodes = [...dataModel.value.nodes, node]
}

const onSubmit = () => {
  addNode({ title: title.value, id: Date.now().toString(), x: 200, y: 0 })
}

const onElementClicked = (ev) => {
  console.log('ev', ev)
  ev.el.scale.x *= 1.25
  ev.el.scale.y *= 1.25
}

const onCanvasClicked = (ev) => {
  const { x, y } = ev
  const newNode = { title: 'randon', id: '', x, y }
  addNode(newNode)
}

const onDrag = (ev) => {
  console.log('ev', ev)
}
</script>

<template>
  <div>
    <Canvas :data-model="dataModel" @element-clicked="onElementClicked" @canvas-clicked="onCanvasClicked"></Canvas>
    <div class="fixed top-4 right-4 h-[50vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Widget</h1>
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="title" class="border" />
        <button type="submit">Add</button>
      </form>

      <pre>
        {{ dataModel }}
      </pre>
    </div>
    <div
      draggable
      @dragstart="onDrag"
      class="fixed bottom-0 left-4 w-60 h-60 bg-red-300 shadow-lg translate-y-40 hover:translate-y-28 transition-transform"
    ></div>
  </div>
</template>
