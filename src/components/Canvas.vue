<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { onMounted, ref, watch } from 'vue'
import { Application } from 'pixi.js'
import CanvasNode from './CanvasNode'
import useNodes from '../composables/useNodes'

// const props = defineProps({
//   nodes: {
//     type: Array as () => NodeModel[],
//     required: true,
//     default: () => [],
//   },
// })
const { nodes, updateNodePosition } = useNodes()
const emit = defineEmits(['element-clicked', 'canvas-clicked', 'element-dropped', 'element-moved'])

const canvas = ref<HTMLCanvasElement>()
let viewport: Viewport
let app: Application

onMounted(() => {
  init()
})

const init = () => {
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xf3f3f3,
  })
  document.getElementById('canvas')?.replaceWith(app.view)
  // https://github.com/pixijs/pixijs/wiki/v5-Hacks#prevent-pinch-gesture-in-chrome
  canvas.value?.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault()
    },
    { passive: false }
  )

  viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    interaction: app.renderer.plugins.interaction,
  })
  viewport.on('clicked', (ev) => {
    emit('canvas-clicked', { x: ev.world.x, y: ev.world.y, ev: ev })
  })

  app.stage.addChild(viewport)

  // activate plugins
  viewport.drag().pinch().wheel().decelerate()

  render()
}

const render = () => {
  viewport.removeChildren()

  nodes.value.forEach(({ x, y, id }) => {
    const node = CanvasNode({ x, y }, viewport)
    node.on('drop', (ev) => {
      updateNodePosition(id, { x: ev.x, y: ev.y })
      emit('element-moved', ev)
    })

    viewport.addChild(node)
  })
}

watch(
  nodes,
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
    emit('element-dropped', { x, y })
  }
}
</script>

<template>
  <div class="fixed inset-0" @dragover="onDragOver" @drop="onDropFromOutside">
    <div id="canvas"></div>
  </div>
</template>
