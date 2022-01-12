import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasNode from '../components/CanvasNode'
import useCanvas from './useCanvas'

const nodes = useStorage<NodeModel[]>('nodes', [])
const { viewport } = useCanvas()

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)
  const getIndexById = (id: string) => nodes.value.findIndex((n) => n.id === id)

  const addNode = ({ x, y }: Position, title = '') => {
    const id = uuid()
    const newNode: NodeModel = { title, id, x, y }
    const canvasEl = CanvasNode({ x, y, id })
    viewport.addChild(canvasEl)
    nodes.value = [...nodes.value, newNode]
  }

  const updateNodePosition = (id: string, { x, y }: Position): NodeModel => {
    const node = getNodeById(id)
    const index = getIndexById(id)
    if (node) {
      const updatedNode: NodeModel = { ...node, x, y }
      nodes.value = [...nodes.value.slice(0, index), updatedNode, ...nodes.value.slice(index + 1)]
      return updatedNode
    }
    throw Error('Node not found')
  }

  return {
    nodes,
    getNodeById,
    addNode,
    updateNodePosition,
  }
}

export default useNodes
