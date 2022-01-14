import { Position, useStorage } from '@vueuse/core'
import { NodeModel } from '../types'
import { v4 as uuid } from 'uuid'
import CanvasNode from '../components/CanvasNode'
import useCanvas from './useCanvas'

const nodes = useStorage<NodeModel[]>('nodes', [])
const { viewport } = useCanvas()

type AddNodeProps = Omit<NodeModel, 'id'> & { id?: string }

const onPortClicked = () => {
  console.log('ev')
}

const useNodes = () => {
  const getNodeById = (id: string) => nodes.value.find((n) => n.id === id)
  const getIndexById = (id: string) => nodes.value.findIndex((n) => n.id === id)

  const addNode = (props: AddNodeProps) => {
    // create data model
    const { data, x, y, id = uuid() } = props
    const newNode: NodeModel = { data, id, x, y }
    nodes.value = [...nodes.value, newNode]

    // create corresponding canvas el
    const canvasEl = CanvasNode({ x, y, id })
    canvasEl.on('port-clicked', onPortClicked)
    viewport.addChild(canvasEl)

    return newNode
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

  return {
    nodes,
    getNodeById,
    getIndexById,
    addNode,
    updateNodePosition,
    onPortClicked,
  }
}

export default useNodes
