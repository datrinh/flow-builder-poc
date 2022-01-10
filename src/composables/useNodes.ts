import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'

const nodes = useStorage<NodeModel[]>('nodes', [])

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)

  const addNode = ({ x, y }: Position, title = '') => {
    const newNode = { x, y, title, id: uuid() }
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
    addNode,
    updateNodePosition,
  }
}

export default useNodes
