import { Position } from '@vueuse/core'
import { Container, Graphics, InteractionEvent, Sprite } from 'pixi.js'
import useCanvas from '../composables/useCanvas'

const THRESHOLD_RADIUS = 8 * 8
const { viewport } = useCanvas()

const withDragDrop = (element: Sprite | Graphics | Container) => {
  let isDown = false
  let isMoving = false
  let dragOffset: Position
  let startEmitted = false
  let firstPos: Position

  element.on('pointerdown', (ev: InteractionEvent) => {
    ev.stopPropagation()
    dragOffset = ev.data.getLocalPosition(element)
    firstPos = ev.data.global.clone()
    isDown = true
    isMoving = false
  })

  element.on('pointermove', (ev: InteractionEvent) => {
    if (!isDown) return
    const pos = ev.data.global

    const dx = firstPos.x - pos.x
    const dy = firstPos.y - pos.y
    const distance = dx * dx + dy * dy // skip square-root (see above)

    if (distance >= THRESHOLD_RADIUS) {
      isMoving = true
    }

    if (isMoving) {
      console.log('startEmitted', startEmitted)
      element.emit('drag-move', ev, dragOffset)

      if (!startEmitted) {
        element.emit('drag-start', ev)
        startEmitted = true
      }
    }
  })

  element.on('pointerup', (ev) => {
    if (!isDown) return
    isDown = false
    startEmitted = false

    if (!isMoving) {
      element.emit('clicked', ev)
    } else {
      element.emit('drag-end', ev)
    }
  })

  viewport.on('pointerup', () => {
    startEmitted = false
    isDown = false
  })

  return element
}

export default withDragDrop
