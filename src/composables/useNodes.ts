import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasNode from '../components/CanvasNode'
import useCanvas from './useCanvas'

const nodes = useStorage<NodeModel[]>('nodes', [])
const { viewport } = useCanvas()

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)

  const addNode = ({ x, y }: Position, title = '') => {
    const canvasEl = CanvasNode({ x, y }, viewport)
    const newNode: NodeModel = { title, id: uuid(), canvasEl }
    nodes.value = [...nodes.value, newNode]
  }

  const updateNodePosition = (id: string, { x, y }: Position): NodeModel => {
    let node = getNodeById(id)
    if (node) {
      node.x = x
      node.y = y

      return node
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
