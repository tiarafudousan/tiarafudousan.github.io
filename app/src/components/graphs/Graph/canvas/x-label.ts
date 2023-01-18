import { CanvasContext, Layout, Box, XAxisAlign, XLabel } from "./types"
import { getCanvasX } from "./math"

function getTop(
  graph: Box,
  labelHeight: number,
  params: { xAxisAlign: XAxisAlign; xTickLength: number }
): number {
  const { xAxisAlign, xTickLength } = params

  if (xAxisAlign == "top") {
    return graph.top - labelHeight - xTickLength
  }
  if (xAxisAlign == "bottom") {
    return graph.top + graph.height + xTickLength
  }

  return 0
}

function getLineStart(
  graph: Box,
  params: { xAxisAlign: XAxisAlign; xTickLength: number }
): number {
  const { xAxisAlign, xTickLength } = params

  if (xAxisAlign == "top") {
    return graph.top - xTickLength
  }
  if (xAxisAlign == "bottom") {
    return graph.top + graph.height + xTickLength
  }

  return 0
}

function getLineEnd(graph: Box, params: { xAxisAlign: XAxisAlign }): number {
  const { xAxisAlign } = params

  if (xAxisAlign == "top") {
    return graph.top + graph.height
  }
  if (xAxisAlign == "bottom") {
    return graph.top
  }

  return 0
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  label: Partial<XLabel>,
  params: {
    xMin: number
    xMax: number
    xAxisAlign: XAxisAlign
    xTickLength: number
  }
) {
  const {
    x,
    width = 50,
    height = 20,
    backgroundColor = "white",
    font = "",
    color = "black",
    textPadding = 10,
    render,
    drawLine = true,
    lineWidth = 1,
    lineColor = "black",
  } = label
  const { graph } = layout
  const { xMin, xMax } = params

  if (x != undefined && xMin <= x && x <= xMax) {
    const canvasX = getCanvasX(graph.width, graph.left, xMax, xMin, x)
    const left = canvasX - Math.round(width / 2)
    const top = getTop(graph, height, params)

    // label box
    ctx.fillStyle = backgroundColor
    ctx.fillRect(left, top, width, height)

    // text
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (render) {
      ctx.fillText(render(x), left + width / 2, top + textPadding)
    }

    if (drawLine) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor

      const lineStart = getLineStart(graph, params)
      const lineEnd = getLineEnd(graph, params)

      ctx.beginPath()
      ctx.moveTo(left + width / 2, lineStart)
      ctx.lineTo(left + width / 2, lineEnd)
      ctx.stroke()
    }
  }
}
