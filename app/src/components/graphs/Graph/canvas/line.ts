import { CanvasContext, Layout, Point, LineGraph as Graph } from "./types"
import { getCanvasX, getCanvasY } from "./math"

interface Params {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  graph: Partial<Graph>,
  params: Params
) {
  const {
    graph: { top, left, width, height },
  } = layout

  const { data = [], step = 0, lineColor = "" } = graph
  const { xMin, xMax, yMin, yMax } = params

  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1

  if (step > 0) {
    ctx.beginPath()
    for (let i = 0; i < data.length; i += step) {
      const { x, y } = data[i]

      if (x >= xMin && x <= xMax) {
        ctx.lineTo(
          getCanvasX(width, left, xMax, xMin, x),
          getCanvasY(height, top, yMax, yMin, y)
        )
      }
    }
    ctx.stroke()
  }
}
