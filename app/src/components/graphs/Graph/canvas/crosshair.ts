import { CanvasContext, Layout, Crosshair } from "./types"
import { isInside } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  crosshair: Partial<Crosshair>
) {
  const {
    graph: { width, height, left, top },
  } = layout

  const {
    canvasX = 0,
    canvasY = 0,
    xLineColor = "",
    xLineWidth = 0.5,
    yLineColor = "",
    yLineWidth = 0.5,
  } = crosshair

  if (!isInside({ top, left, width, height }, { x: canvasX, y: canvasY })) {
    return
  }

  // x line
  ctx.strokeStyle = xLineColor
  ctx.lineWidth = xLineWidth

  ctx.beginPath()
  ctx.moveTo(canvasX, top)
  ctx.lineTo(canvasX, top + height)
  ctx.stroke()

  // y line
  ctx.strokeStyle = yLineColor
  ctx.lineWidth = yLineWidth

  ctx.beginPath()
  ctx.moveTo(left, canvasY)
  ctx.lineTo(left + width, canvasY)
  ctx.stroke()
}
