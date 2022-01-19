import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js' // TODO: replace with tree shakable import in prod
import { NodeModel } from '../types'
import { Link } from './useLinks'
import { DisplayObject } from 'pixi.js'
import { forceLayout } from '../utils/layout'
;(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf3f3f3,
  antialias: true,
  resolution: window.devicePixelRatio,
  autoDensity: true,
})
const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,
  interaction: app.renderer.plugins.interaction,
})
// app.ticker.maxFPS = 60
app.stage.addChild(viewport)

// activate plugins
viewport.clampZoom({ minWidth: 800, maxWidth: 5000 }).drag().pinch().wheel().decelerate()

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

  const autoLayout = (nodes: NodeModel[], links: Link[]) => {
    forceLayout(nodes, links)
    // treeLayout(nodes, links)
  }

  const addChild = (child: DisplayObject) => viewport.addChild(child)

  const removeChild = (child: DisplayObject) => viewport.removeChild(child)

  const getChildByName = (name: string) => viewport.getChildByName(name)

  return {
    init,
    autoLayout,
    addChild,
    removeChild,
    getChildByName,
    app,
    viewport,
  }
}

export default useCanvas
