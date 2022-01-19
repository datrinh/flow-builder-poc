import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasNode from '../canvas/CanvasNode'
import useCanvas from './useCanvas'
import useLinks from './useLinks'

const nodes = useStorage<NodeModel[]>('nodes', [])
const { viewport } = useCanvas()
const { getConnectedLinksForElement, removeLink } = useLinks()

type AddNodeProps = Omit<NodeModel, 'id'> & { id?: string }

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)
  const getIndexById = (id: string) => nodes.value.findIndex((n) => n.id === id)

  const addNode = (props: AddNodeProps) => {
    // create data model
    const { data, x, y, id = uuid() } = props
    const newNode: NodeModel = { data, id, x, y }
    nodes.value = [...nodes.value, newNode]

    // create corresponding canvas el
    const canvasEl = new CanvasNode({ x, y, id })
    viewport.addChild(canvasEl)

    return newNode
  }

  const removeNode = (id: string) => {
    nodes.value = nodes.value.filter((node) => node.id !== id)
    const links = getConnectedLinksForElement(id)
    links.forEach((l) => {
      removeLink(l.id)
    })
    viewport.removeChild(viewport.getChildByName(id))
  }

  const updateNodePosition = (id: string, { x, y }: Position): NodeModel => {
    const node = getNodeById(id)
    if (node) {
      node.x = x
      node.y = y

      return node
    }

    throw Error('Node not found')
  }

  const updateNodeData = (id: string, data: NodeModel['data']) => {
    const node = getNodeById(id)
    if (node) {
      node.data = data
    }
  }

  return {
    nodes,
    getNodeById,
    getIndexById,
    addNode,
    removeNode,
    updateNodePosition,
    updateNodeData,
  }
}

export default useNodes
