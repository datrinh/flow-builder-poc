import { Group, Tween } from 'tweedle.js'

function animate() {
  requestAnimationFrame(animate)
  Group.shared.update()
}
requestAnimationFrame(animate)

export const fadeIn = (element: unknown, duration = 300) => {
  new Tween(element).to({ alpha: 1 }, duration).start()
}

export const fadeOut = (element: unknown, duration = 300) => {
  new Tween(element).to({ alpha: 0 }, duration).start()
}

export const size = (element: { width: number; height: number }, toSize: number, duration = 300) => {
  new Tween(element).to({ width: toSize, height: toSize }, duration).start()
}
