import { CanvasContext, Layout, XAxisAlign, XAxis } from "./types"
import { getCanvasX, stepBelow } from "./math"

const TICK_TEXT_PADDING = 10

interface Tick {
  xAxisAlign: XAxisAlign
  xAxisFont: string
  xAxisLineColor: string
  xAxisTextColor: string
  xTickLength: number
  renderXTick?: (x: number) => string
  xMin: number
  xMax: number
}

function drawTick(ctx: CanvasContext, layout: Layout, tick: Tick, x: number) {
  const {
    xAxis: { top, left, width, height },
  } = layout

  const {
    xAxisAlign,
    xAxisFont,
    xAxisLineColor,
    xAxisTextColor,
    xTickLength,
    renderXTick,
    xMin,
    xMax,
  } = tick

  const canvasX = getCanvasX(width, left, xMax, xMin, x)

  ctx.font = xAxisFont
  ctx.fillStyle = xAxisTextColor
  ctx.strokeStyle = xAxisLineColor
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  if (xAxisAlign == "top") {
    ctx.beginPath()
    ctx.moveTo(canvasX, top + height)
    ctx.lineTo(canvasX, top + height - xTickLength)
    ctx.stroke()

    if (renderXTick) {
      ctx.fillText(
        renderXTick(x),
        canvasX,
        top + height - xTickLength - TICK_TEXT_PADDING
      )
    }
  } else if (xAxisAlign == "bottom") {
    ctx.beginPath()
    ctx.moveTo(canvasX, top)
    ctx.lineTo(canvasX, top + xTickLength)
    ctx.stroke()

    if (renderXTick) {
      ctx.fillText(
        renderXTick(x),
        canvasX,
        top + xTickLength + TICK_TEXT_PADDING
      )
    }
  }
}

interface Line {
  xLineColor: string
  xMax: number
  xMin: number
}

function drawLine(ctx: CanvasContext, layout: Layout, line: Line, x: number) {
  const {
    graph: { left, top, width, height },
  } = layout
  const { xLineColor, xMax, xMin } = line

  const canvasX = getCanvasX(width, left, xMax, xMin, x)

  ctx.strokeStyle = xLineColor

  ctx.beginPath()
  ctx.moveTo(canvasX, top)
  ctx.lineTo(canvasX, top + height)
  ctx.stroke()
}

export function draw(ctx: CanvasContext, layout: Layout, xAxis: XAxis) {
  const {
    xAxis: { top, left, width, height },
  } = layout

  const {
    xAxisAlign,
    xAxisLineColor,
    xTicks,
    xTickInterval,
    showXLine,
    xMin,
    xMax,
  } = xAxis

  // style x axis line
  ctx.lineWidth = 1
  ctx.strokeStyle = xAxisLineColor

  if (xAxisAlign == "top") {
    ctx.beginPath()
    ctx.moveTo(left, top + height)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
  } else if (xAxisAlign == "bottom") {
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(left + width, top)
    ctx.stroke()
  }

  if (xTickInterval > 0) {
    const x0 = stepBelow(xMin, xTickInterval)

    for (let x = x0; x <= xMax; x += xTickInterval) {
      if (xMin <= x && x <= xMax) {
        drawTick(ctx, layout, xAxis, x)

        if (showXLine) {
          drawLine(ctx, layout, xAxis, x)
        }
      }
    }
  }

  for (const x of xTicks) {
    if (xMin <= x && x <= xMax) {
      drawTick(ctx, layout, xAxis, x)

      if (showXLine) {
        drawLine(ctx, layout, xAxis, x)
      }
    }
  }
}
