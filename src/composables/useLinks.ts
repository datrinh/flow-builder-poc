import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasLink from '../canvas/CanvasLink'
import useCanvas from './useCanvas'

type LinkType = 'directed' | 'undirected'

export interface Link {
  id: string
  from: string
  to: string
  type: LinkType
}

const links = useStorage<Link[]>('links', [])
const { viewport } = useCanvas()

const useLinks = () => {
  const addLink = (from: Link['from'], to: Link['to'], type: LinkType = 'directed') => {
    const linkExists = links.value.some((link) => {
      link.from === from && link.to === to
    })
    if (linkExists) return

    const id = uuid()
    const newLink = { from, to, type, id }
    links.value = [...links.value, newLink]

    const canvasEl = new CanvasLink({ from, to, id })
    viewport.addChild(canvasEl)
  }

  const removeLink = (id: string) => {
    links.value = links.value.filter((link) => link.id !== id)
    viewport.removeChild(viewport.getChildByName(id))
  }

  const getConnectedLinksForElement = (elId: string) => {
    return links.value.filter((link) => link.from === elId || link.to === elId)
  }

  return {
    links,
    addLink,
    removeLink,
    getConnectedLinksForElement,
  }
}

export default useLinks
