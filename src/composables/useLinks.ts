import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasLink from '../components/CanvasLink'
import useCanvas from './useCanvas'

type LinkDirection = 'unidirectional' | 'bidirectional'

interface Link {
  from: string
  to: string
  direction: LinkDirection
}

const links = useStorage<Link[]>('links', [])
const { viewport } = useCanvas()

const useLinks = () => {
  const addLink = (from: Link['from'], to: Link['to'], direction: LinkDirection = 'unidirectional') => {
    const newLink = { from, to, direction }
    links.value = [...links.value, newLink]

    const canvasEl = CanvasLink({ from, to })
    viewport.addChild(canvasEl)
  }

  return {
    links,
    addLink,
  }
}

export default useLinks
