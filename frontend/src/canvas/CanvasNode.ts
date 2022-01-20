import { Container, Text } from 'pixi.js'
import { SmoothGraphics as Graphics } from '@pixi/graphics-smooth'
import useCanvas from '../composables/useCanvas'
import useNodes from '../composables/useNodes'
import { computed, watchEffect } from 'vue'
import { fadeIn } from '../utils/animations'
import withDragDrop from '../utils/withDragDrop'
import useLinks from '../composables/useLinks'
// import { drawLine } from './CanvasLink'
import NodeShell from './NodeShell'
import OriginPort from '../components/OriginPort'
import TargetPort from '../components/TargetPort'
import { CanvasElementType, AdditionalProps } from '../types'
import CanvasLink from './CanvasLink'

interface CanvasNodeProps {
  x: number
  y: number
  id: string // ref to the data model
}

const { viewport } = useCanvas()
const { updateNodePosition, getNodeById } = useNodes()
const { getConnectedLinksForElement } = useLinks()

class CanvasNode extends Container implements AdditionalProps {
  public nodeModel
  public shell = withDragDrop(NodeShell(this.name)) as Graphics
  public text
  public connectedLinks = computed(() => getConnectedLinksForElement(this.name))
  public type: CanvasElementType = 'node'

  constructor({ x, y, id }: CanvasNodeProps) {
    super()
    this.x = x
    this.y = y
    this.name = id
    this.buttonMode = true
    this.interactive = true
    this.position.set(x, y)
    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
    this.alpha = 0
    this.nodeModel = getNodeById(this.name)
    this.text = new Text(this.nodeModel?.data.title || '', {
      fontSize: 16,
      fill: '#000',
      wordWrap: true,
      wordWrapWidth: this.shell.width * 0.8,
    })

    this.initShell()
    this.initText()
    this.initPorts()
    fadeIn(this)

    watchEffect(() => {
      this.update()
    })
  }

  private initShell() {
    this.shell
      .on('drag-end', () => {
        updateNodePosition(this.name, { x: this.x, y: this.y })
      })
      .on('clicked', (ev) => {
        this.emit('clicked-shell', { id: this.name, event: ev })
      })
      .on('drag-move', (ev, offset) => {
        const newPosition = ev.data.getLocalPosition(viewport)
        this.x = newPosition.x - offset.x
        this.y = newPosition.y - offset.y

        // update connected links
        this.connectedLinks.value.forEach(({ from, to, id }) => {
          const link = viewport.getChildByName(id) as CanvasLink
          link.update()
          // drawLine(link, { from, to })
        })
      })

    this.addChild(this.shell)
  }

  private initPorts() {
    const originPort = OriginPort(this)
    const targetPort = TargetPort(this)
    this.addChild(originPort)
    this.addChild(targetPort)
  }

  private initText() {
    let label = this.nodeModel?.data.title || ''
    this.text = new Text(label, {
      fontSize: 16,
      fill: '#000',
      wordWrap: true,
      wordWrapWidth: this.shell.width * 0.8,
    })
    this.text.x = 10
    this.text.y = 15
    this.text.resolution = 2
    this.addChild(this.text)
  }

  public update() {
    if (this.nodeModel) {
      this.x = this.nodeModel.x
      this.y = this.nodeModel.y
      this.text.text = this.nodeModel.data.title
    }
  }
}

export default CanvasNode
