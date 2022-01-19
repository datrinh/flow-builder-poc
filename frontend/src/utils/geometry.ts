import type { Rectangle } from 'pixi.js'
import { Position } from '../types'

export const distance = (p1: Position, p2: Position): number => {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const isWithinBounds = (point: Position, bounds: Rectangle): boolean => {
  const topLeft = { x: bounds.x, y: bounds.y }
  const bottomRight = { x: bounds.x + bounds.width, y: bounds.y + bounds.height }

  return topLeft.x <= point.x && point.x <= bottomRight.x && topLeft.y <= point.y && point.y <= bottomRight.y
}
