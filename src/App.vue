<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()

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
  canvas.value?.addEventListener('wheel',
    (e) => { e.preventDefault() },
    { passive: false }
  )

  const viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    // stopPropagation: true,
    // passiveWheel: true,
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  })

  app.stage.addChild(viewport)

  // activate plugins
  viewport.drag().pinch().wheel().decelerate()

  for (let i = 0; i < 10; i++) {
    const square = new PIXI.Sprite(PIXI.Texture.WHITE)
    square.position.set(i * 100, (app.screen.height - 100) / 2)
    square.width = 50
    square.height = 50
    square.tint = 0x00ff00

    viewport.addChild(square)
  }
}
</script>

<template>
  <div>
    <div id="canvas" ref="canvas"></div>
    <div class="fixed top-4 right-4 h-[50vh] w-60 bg-white rounded-sm p-4 shadow-sm">Widget</div>
  </div>
</template>
