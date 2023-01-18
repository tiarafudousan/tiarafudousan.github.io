import { CanvasContext, Layout, PointGraph, Range } from "./types"
import { getCanvasX, getCanvasY } from "./math"

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  graph: Partial<PointGraph>,
  range: Range
) {
  const {
    graph: { top, left, width, height },
  } = layout

  const {
    data = [],
    color = "",
    radius = 1,
    ambientColor = "",
    ambientRadius = 0,
  } = graph

  const { xMin, xMax, yMin, yMax } = range

  for (const point of data) {
    const { x, y } = point

    if (xMin <= x && x <= xMax) {
      const canvasX = getCanvasX(width, left, xMax, xMin, x)
      const canvasY = getCanvasY(height, top, yMax, yMin, y)

      if (ambientRadius > 0) {
        ctx.beginPath()
        ctx.arc(canvasX, canvasY, ambientRadius, 0, 2 * Math.PI, false)
        ctx.fillStyle = ambientColor
        ctx.fill()
      }

      if (radius > 0) {
        ctx.beginPath()
        ctx.arc(canvasX, canvasY, radius, 0, 2 * Math.PI, false)
        ctx.fillStyle = color
        ctx.fill()
      }
    }
  }
}
