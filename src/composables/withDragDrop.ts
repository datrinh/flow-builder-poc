import { Position } from '@vueuse/core'
import { Container, Graphics, InteractionEvent, Sprite } from 'pixi.js'

const withDragDrop = (element: Sprite | Graphics | Container) => {
  let isDown = false
  let isMoving = false
  let dragOffset: Position
  let firstPos: Position
  const THRESHOLD_RADIUS = 8 * 8

  element.on('pointerdown', (ev: InteractionEvent) => {
    // console.log('ev', ev)
    ev.stopPropagation()
    dragOffset = ev.data.getLocalPosition(element)
    firstPos = ev.data.global.clone()
    isDown = true // record mouse state
    isMoving = false // reset move state
  })

  element.on('pointermove', (ev: InteractionEvent) => {
    if (!isDown) return // we will only act if mouse button is down
    const pos = ev.data.global // get current mouse position

    // calculate distance from click point to current point
    const dx = firstPos.x - pos.x
    const dy = firstPos.y - pos.y
    const distance = dx * dx + dy * dy // skip square-root (see above)

    if (distance >= THRESHOLD_RADIUS) {
      isMoving = true
    }

    if (isMoving) {
      //   ctx.clearRect(0,0,canvas.width,canvas.height);
      //   ctx.strokeRect(wp.x, wp.y, wp.width, wp.height);
      //   ctx.fillText("MOVING", 10, 30);
      // onMove()
      element.emit('drag-move', ev, dragOffset)
    }
  })

  element.on('pointerup', (ev) => {
    if (!isDown) return // no need for us in this case
    isDown = false // record mouse state

    if (!isMoving) {
      // if (
      //   firstPos.x >= element.x &&
      //   firstPos.x < element.x + element.width &&
      //   firstPos.y >= element.y &&
      //   firstPos.y < element.y + element.height
      // ) {
      // onClick()
      element.emit('clicked', ev)
      //   } else {
      //     onClick()
      //   }
    } else {
      element.emit('drag-end', ev)
      // onDragEnd()
    }
  })

  return element
}

export default withDragDrop
