import { Position } from '@vueuse/core'
import { Container, Graphics, InteractionEvent, Sprite } from 'pixi.js'

const THRESHOLD_RADIUS = 8 * 8

const withDragDrop = (element: Sprite | Graphics | Container) => {
  let isDown = false
  let isMoving = false
  let dragOffset: Position
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
      element.emit('drag-move', ev, dragOffset)
    }
  })

  element.on('pointerup', (ev) => {
    if (!isDown) return
    isDown = false

    if (!isMoving) {
      element.emit('clicked', ev)
    } else {
      element.emit('drag-end', ev)
    }
  })

  return element
}

export default withDragDrop
