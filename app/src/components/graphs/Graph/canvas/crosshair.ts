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
    point,
    xLineColor = "",
    xLineWidth = 0.5,
    yLineColor = "",
    yLineWidth = 0.5,
  } = crosshair

  if (!point) {
    return
  }

  if (!isInside({ top, left, width, height }, { x: point.x, y: point.y })) {
    return
  }

  // x line
  ctx.strokeStyle = xLineColor
  ctx.lineWidth = xLineWidth

  ctx.beginPath()
  ctx.moveTo(point.x, top)
  ctx.lineTo(point.x, top + height)
  ctx.stroke()

  // y line
  ctx.strokeStyle = yLineColor
  ctx.lineWidth = yLineWidth

  ctx.beginPath()
  ctx.moveTo(left, point.y)
  ctx.lineTo(left + width, point.y)
  ctx.stroke()
}
