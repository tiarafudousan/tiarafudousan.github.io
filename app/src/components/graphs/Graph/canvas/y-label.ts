import {
  CanvasContext,
  Layout,
  Box,
  YLabel,
  YAxisAlign,
  TextAlign,
} from "./types"
import { getCanvasY } from "./math"

function getLeft(
  graph: Box,
  labelWidth: number,
  params: { yAxisAlign: YAxisAlign; yTickLength: number }
): number {
  const { yAxisAlign, yTickLength } = params

  if (yAxisAlign == "left") {
    return graph.left - labelWidth - yTickLength
  }
  if (yAxisAlign == "right") {
    return graph.left + graph.width + yTickLength
  }

  return 0
}

function getTextAlign(yAxisAlign: YAxisAlign): TextAlign {
  switch (yAxisAlign) {
    case "left":
      return "right"
    case "right":
      return "left"
    default:
      console.error(`invalid yAxisAlign ${yAxisAlign}`)
      return "right"
  }
}

function getTextLeft(
  left: number,
  label: { textPadding: number; width: number },
  yAxisAlign: YAxisAlign
): number {
  const { textPadding, width } = label

  switch (yAxisAlign) {
    case "left":
      return left + width - textPadding
    case "right":
      return left + textPadding
    default:
      console.error(`invalid yAxisAlign ${yAxisAlign}`)
      return left + width - textPadding
  }
}

function getLineStart(
  graph: Box,
  params: { yAxisAlign: YAxisAlign; yTickLength: number }
): number {
  const { yAxisAlign, yTickLength } = params

  if (yAxisAlign == "left") {
    return graph.left - yTickLength
  }
  if (yAxisAlign == "right") {
    return graph.left + graph.width + yTickLength
  }

  return 0
}

function getLineEnd(graph: Box, params: { yAxisAlign: YAxisAlign }): number {
  const { yAxisAlign } = params

  if (yAxisAlign == "left") {
    return graph.left + graph.width
  }
  if (yAxisAlign == "right") {
    return graph.left
  }

  return 0
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  label: Partial<YLabel>,
  params: {
    yAxisAlign: YAxisAlign
    yTickLength: number
    yMin: number
    yMax: number
  }
) {
  const {
    y,
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
  const { yMin, yMax } = params

  if (y != undefined && yMin <= y && y <= yMax) {
    const canvasY = getCanvasY(graph.height, graph.top, yMax, yMin, y)
    const top = canvasY - Math.round(height / 2)
    const left = getLeft(graph, width, params)

    ctx.fillStyle = backgroundColor

    // label box
    ctx.fillRect(left, top, width, height)

    // text
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = getTextAlign(params.yAxisAlign)
    ctx.textBaseline = "middle"

    if (render) {
      ctx.fillText(
        render(y),
        getTextLeft(left, { textPadding, width }, params.yAxisAlign),
        top + textPadding
      )
    }

    if (drawLine) {
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = lineColor

      const lineStart = getLineStart(graph, params)
      const lineEnd = getLineEnd(graph, params)

      ctx.beginPath()
      ctx.moveTo(lineStart, top + height / 2)
      ctx.lineTo(lineEnd, top + height / 2)
      ctx.stroke()
    }
  }
}
