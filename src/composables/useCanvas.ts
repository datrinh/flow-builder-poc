import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
;(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf3f3f3,
  antialias: true,
})
const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,
  interaction: app.renderer.plugins.interaction,
})

app.stage.addChild(viewport)

// activate plugins
viewport.drag().pinch().wheel().decelerate()

const useCanvas = () => {
  const init = (el: HTMLElement) => {
    el.replaceWith(app.view)
    // https://github.com/pixijs/pixijs/wiki/v5-Hacks#prevent-pinch-gesture-in-chrome
    app.view.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
      },
      { passive: false }
    )
  }

  return {
    init,
    app,
    viewport,
  }
}

export default useCanvas
