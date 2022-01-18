import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import { Graphics } from 'pixi.js'

const NodeShell = (id: string) => {
  const shell = new Graphics()
  shell.beginFill(0xffffff)
  shell.drawRoundedRect(0, 0, 150, 100, 16)
  shell.endFill()
  shell.filters = [new DropShadowFilter({ rotation: 90, blur: 1, color: 0xababab })]
  shell.interactive = true
  shell.buttonMode = true
  shell.name = id

  shell.on('pointerover', () => {
    shell.lineStyle(2, 0xfff171)
    shell.drawRoundedRect(0, 0, 150, 100, 16)
  })

  shell.on('pointerout', () => {
    shell.clear()
    shell.beginFill(0xffffff)
    shell.drawRoundedRect(0, 0, 150, 100, 16)
  })

  return shell
}

export default NodeShell
