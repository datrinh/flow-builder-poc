import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3'
import { Link } from '../composables/useLinks'
import { NodeModel } from '../types'

export const forceLayout = (nodes: NodeModel[], links: Link[]) => {
  const simulation = forceSimulation(nodes)
    .force(
      'link',
      forceLink(links.map((l) => ({ source: l.from, target: l.to })))
        .id((d) => (d as Link).id)
        .distance(50)
    )
    .force('charge', forceManyBody().strength(-2000))
    .force('center', forceCenter(500, 500))
    .force('collision', forceCollide().radius(100).iterations(2))
    .velocityDecay(0.8)

  return simulation
}

export const treeLayout = (nodes: NodeModel[], links: Link[]) => {
  // TODO
}
