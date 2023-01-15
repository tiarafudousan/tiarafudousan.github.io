import { CanvasContext, Layout, YAxisAt, TextAlign } from "./types"
import { getCanvasY } from "./math"

export interface YLabel {
  y?: number
  width: number
  height: number
  backgroundColor: string
  color: string
  font: string
  textPadding: number
  render: (y?: number) => string
  drawLine: boolean
  lineWidth: number
  lineColor: string
}

const DEFAULT_PROPS = {
  width: 50,
  height: 20,
  backgroundColor: "white",
  font: "",
  color: "black",
  textPadding: 10,
  render: () => "",
  drawLine: true,
  lineColor: "black",
  lineWidth: 1,
}

function withDefaultProps(props: Partial<YLabel>): YLabel {
  return {
    ...DEFAULT_PROPS,
    ...props,
  }
}

function getLeft(
  label: YLabel,
  layout: Layout,
  props: { yAxisAt: YAxisAt; yTickLength: number }
): number {
  const { graph } = layout
  const { yAxisAt, yTickLength } = props

  if (yAxisAt === "left") {
    return graph.left - label.width - yTickLength
  }
  if (yAxisAt === "right") {
    return graph.left + graph.width + yTickLength
  }

  return 0
}

function getTextAlign(props: { yAxisAt: YAxisAt }): TextAlign {
  const { yAxisAt } = props

  switch (yAxisAt) {
    case "left":
      return "right"
    case "right":
      return "left"
    default:
      console.error(`invalid yAxisAt ${yAxisAt}`)
      return "right"
  }
}

function getTextLeft(
  left: number,
  label: YLabel,
  props: { yAxisAt: YAxisAt }
): number {
  const { yAxisAt } = props
  const { textPadding, width } = label

  switch (yAxisAt) {
    case "left":
      return left + width - textPadding
    case "right":
      return left + textPadding
    default:
      console.error(`invalid yAxisAt ${yAxisAt}`)
      return left + width - textPadding
  }
}

function getLineStart(
  layout: Layout,
  props: { yAxisAt: YAxisAt; yTickLength: number }
): number {
  const { graph } = layout
  const { yAxisAt, yTickLength } = props

  if (yAxisAt === "left") {
    return graph.left - yTickLength
  }
  if (yAxisAt === "right") {
    return graph.left + graph.width + yTickLength
  }

  return 0
}

function getLineEnd(layout: Layout, props: { yAxisAt: YAxisAt }): number {
  const { graph } = layout
  const { yAxisAt } = props

  if (yAxisAt === "left") {
    return graph.left + graph.width
  }
  if (yAxisAt === "right") {
    return graph.left
  }

  return 0
}

export function draw(
  ctx: CanvasContext,
  layout: Layout,
  label: Partial<YLabel>,
  props: { yAxisAt: YAxisAt; yTickLength: number; yMin: number; yMax: number }
) {
  const _label = withDefaultProps(label)

  const {
    y,
    width,
    height,
    backgroundColor,
    font,
    color,
    textPadding,
    render,
    drawLine,
    lineWidth,
    lineColor,
  } = _label

  const { graph } = layout
  const { yMin, yMax } = props

  if (y === undefined) {
    return
  }

  const canvasY = getCanvasY(graph.height, graph.top, yMax, yMin, y)
  const top = canvasY - Math.round(height / 2)
  const left = getLeft(_label, layout, props)

  ctx.fillStyle = backgroundColor

  // label box
  ctx.fillRect(left, top, width, height)

  // text
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = getTextAlign(props)
  ctx.textBaseline = "middle"

  ctx.fillText(render(y), getTextLeft(left, _label, props), top + textPadding)

  if (drawLine) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor

    const lineStart = getLineStart(layout, props)
    const lineEnd = getLineEnd(layout, props)

    ctx.beginPath()
    ctx.moveTo(lineStart, top + height / 2)
    ctx.lineTo(lineEnd, top + height / 2)
    ctx.stroke()
  }
}
