import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'

const nodes = useStorage<NodeModel[]>('nodes', [])

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)

  const addNode = (newNode: NodeModel): NodeModel => {
    nodes.value = [...nodes.value, newNode]

    return newNode
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
    addNode,
    updateNodePosition,
  }
}

export default useNodes
