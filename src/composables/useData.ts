import { useStorage } from '@vueuse/core'
import { NodeModel } from '../types'

const nodes = useStorage<NodeModel[]>('data', [
  {
    id: 'node1',
    title: 'Node 1',
    x: 150,
    y: 150,
  },
])

const useData = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)

  return {
    nodes,
    getNodeById,
  }
}

export default useData
