import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasLink from '../components/CanvasLink'
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
    const id = uuid()
    const newLink = { from, to, type, id }
    links.value = [...links.value, newLink]

    const canvasEl = CanvasLink({ from, to, id })
    viewport.addChild(canvasEl)
  }

  const getConnectedLinksForElement = (elId: string) => {
    return links.value.filter((link) => link.from === elId || link.to === elId)
  }

  return {
    links,
    addLink,
    getConnectedLinksForElement,
  }
}

export default useLinks
