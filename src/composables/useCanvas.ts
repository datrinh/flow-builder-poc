import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3'
import { NodeModel } from '../types'
import { Link } from './useLinks'
;(window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
  (window as any).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI })

let app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xf3f3f3,
  // antialias: true,
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

  const forceLayout = (nodes: NodeModel[], links: Link[]) => {
    const simulation = forceSimulation(nodes)
      .force(
        'link',
        forceLink(links.map((l) => ({ source: l.from, target: l.to })))
          .id((d) => (d as Link).id)
          .distance(50)
      )
      .force('charge', forceManyBody().strength(-2000))
      .force('center', forceCenter(viewport.width / 2, viewport.height / 2))
      .force('collision', forceCollide().radius(100).iterations(2))
      .velocityDecay(0.8)

    return simulation
  }

  const treeLayout = (nodes: NodeModel[], links: Link[]) => {
    // TODO
  }

  const autoLayout = (nodes: NodeModel[], links: Link[]) => {
    forceLayout(nodes, links)
    // treeLayout(nodes, links)
  }

  return {
    init,
    autoLayout,
    app,
    viewport,
  }
}

export default useCanvas
