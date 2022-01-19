import { DisplayObject, InteractionEvent } from 'pixi.js'

export interface Position {
  x: number
  y: number
}

export interface NodeModel {
  id: string
  x: number
  y: number
  data: {
    title: string
  }
}

export interface CanvasEvent {
  id: string
  event: InteractionEvent
}

export type CanvasElementType = 'node' | 'link' | 'port'

export interface AdditionalProps {
  type: CanvasElementType
}

export type CharlesCanvasElementObj = DisplayObject & AdditionalProps
