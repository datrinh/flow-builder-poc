import { Container, Text } from 'pixi.js'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { computed, watchEffect } from 'vue'
import { fadeIn } from '../utils/animations'
import withDragDrop from '../utils/withDragDrop'
import useLinks from '../composables/useLinks'
import { drawLine } from './CanvasLink'
import NodeShell from './NodeShell'
import OriginPort from '../components/OriginPort'
import TargetPort from '../components/TargetPort'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()
const { getConnectedLinksForElement } = useLinks()

const CanvasNode = ({ x, y, id }: CanvasNodeProps) => {
  const nodeModel = getNodeById(id)
  const connectedLinks = computed(() => getConnectedLinksForElement(id))

  const container = withDragDrop(new Container())
  container.name = id
  container.buttonMode = true
  container.interactive = true
  container.position.set(x, y)
  container.pivot.x = container.width / 2
  container.pivot.y = container.height / 2
  container.alpha = 0
  fadeIn(container)

  const shell = withDragDrop(NodeShell(id)) as Graphics
  shell
    .on('drag-end', () => {
      updateNodePosition(container.name, { x: container.x, y: container.y })
    })
    .on('clicked', (ev) => {
      container.emit('clicked-shell', { id, event: ev })
    })
    .on('drag-move', (ev, offset) => {
      const newPosition = ev.data.getLocalPosition(viewport)
      container.x = newPosition.x - offset.x
      container.y = newPosition.y - offset.y

      // update connected links
      connectedLinks.value.forEach(({ from, to, id }) => {
        const link = viewport.getChildByName(id) as Graphics
        drawLine(link, { from, to })
      })
    })

  container.addChild(shell)

  let label = nodeModel?.data.title || ''
  const text = new Text(label, {
    fontSize: 16,
    fill: '#000',
    wordWrap: true,
    wordWrapWidth: shell.width * 0.8,
  })
  text.x = 10
  text.y = 15
  text.resolution = 2
  container.addChild(text)

  const onHover = () => {
    shell.lineStyle(2, 0xababab)
  }

  container.on('pointerover', onHover)

  // const { leftPort, rightPort } = CanvasPort(container)
  const originPort = OriginPort(container)
  const targetPort = TargetPort(container)
  container.addChild(originPort)
  container.addChild(targetPort)

  watchEffect(() => {
    if (nodeModel) {
      container.x = nodeModel.x
      container.y = nodeModel.y
      text.text = nodeModel.data.title
    }
  })

  return container
}

export default CanvasNode
