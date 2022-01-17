<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import useNodes from './composables/useNodes'
import useLinks from './composables/useLinks'
import useCanvas from './composables/useCanvas'
import { CanvasEvent, NodeModel, Position } from './types'
import NodeDetail from './components/NodeDetail.vue'
import { ref } from 'vue'

const { nodes, addNode, getNodeById, updateNodeData } = useNodes()
const { links } = useLinks()
const { viewport, autoLayout } = useCanvas()

const selectedNode = ref<NodeModel>()

const onElementClicked = (ev: CanvasEvent) => {
  selectedNode.value = getNodeById(ev.id)
  console.log('selectedNode', selectedNode.value);
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
const onAutoLayout = () => {
  autoLayout(nodes.value, links.value)
};
const onUpdateData = (data: NodeModel['data']) => {
  updateNodeData(selectedNode.value!.id, data)
  selectedNode.value = undefined
};
</script>

<template>
  <div>
    <Canvas @element-dropped="onCardDropped" @element-clicked="onElementClicked"></Canvas>
    <NodeDetail :title="selectedNode.data.title" v-if="!!selectedNode" @close="selectedNode = undefined" @update="onUpdateData"></NodeDetail>
    <div class="fixed top-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Nodes ({{ nodes.length }})</h1>
      <button @click="reset" class="border p-1">Reset</button>
      <!-- <button @click="onAutoLayout" class="border p-1">Auto Layout</button> -->
      <pre>
        {{ nodes }}
      </pre>
    </div>
    <div class="fixed bottom-4 right-4 h-[40vh] w-60 bg-white rounded-sm p-4 shadow-lg overflow-auto">
      <h1>Links ({{ links.length }})</h1>
      <pre>
        {{ links }}
      </pre>
    </div>

    <div
      draggable="true"
      @dragstart="onDragCard"
      class="fixed bottom-0 left-4 p-4 w-60 h-60 bg-white shadow-xl translate-y-40 hover:translate-y-28 transition-transform cursor-grab"
    >
      New Node
    </div>
  </div>
</template>
