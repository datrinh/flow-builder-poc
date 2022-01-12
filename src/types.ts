import { DisplayObject } from 'pixi.js'

export interface Position {
  x: number
  y: number
}

export interface NodeModel {
  id: string
  title: string
  canvasEl: DisplayObject
}
