<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  dataModel: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['element-clicked', 'canvas-clicked'])

const canvas = ref<HTMLCanvasElement>()
let viewport: Viewport

onMounted(() => {
  init()
})

const init = () => {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xf3f3f3,
  })
  document.getElementById('canvas')?.appendChild(app.view)
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
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
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
  props.dataModel.nodes.forEach((node) => {
    const square = createSquare({ x: node.x, y: node.y })

    viewport.addChild(square)
  })
}

watch(props, () => {
  render()
})

const createSquare = (position: { x: number; y: number }) => {
  const square = new PIXI.Sprite(PIXI.Texture.WHITE)
  square.position.set(position.x, position.y)
  square.width = 50
  square.height = 50
  square.tint = 0x00ff00
  square.interactive = true
  square.buttonMode = true
  square.on('pointerdown', (ev) => {
    emit('element-clicked', { el: square, ev })
  })
  square.on('pointerover', (ev) => {
    square.scale.x *= 1.25
    square.scale.y *= 1.25
    // emit('element-hovered', { el: square, ev })
  })
  square.on('pointerout', (ev) => {
    square.scale.x *= 0.75
    square.scale.y *= 0.75
    // emit('element-hovered', { el: square, ev })
  })

  return square
}
</script>

<template>
  <div id="canvas" ref="canvas"></div>
</template>
