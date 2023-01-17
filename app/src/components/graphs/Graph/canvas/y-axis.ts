import { CanvasContext, Layout, YAxisAlign, YAxis } from "./types"
import { getCanvasY, stepBelow } from "./math"

const TICK_TEXT_PADDING = 5

interface Tick {
  yAxisAlign: YAxisAlign
  yAxisLineColor: string
  yAxisFont: string
  yAxisTextColor: string
  yMax: number
  yMin: number
  yTickLength: number
  renderYTick?: (y: number) => string
}

function drawTick(ctx: CanvasContext, layout: Layout, tick: Tick, y: number) {
  const {
    yAxis: { top, left, height, width },
  } = layout

  const {
    yAxisAlign,
    yAxisLineColor,
    yAxisFont,
    yAxisTextColor,
    yMax,
    yMin,
    yTickLength,
    renderYTick,
  } = tick

  const canvasY = getCanvasY(height, top, yMax, yMin, y)

  ctx.strokeStyle = yAxisLineColor
  ctx.font = yAxisFont
  ctx.fillStyle = yAxisTextColor
  ctx.textAlign = yAxisAlign == "left" ? "right" : "left"
  ctx.textBaseline = "middle"

  if (yAxisAlign == "left") {
    ctx.beginPath()
    ctx.moveTo(left + width, canvasY)
    ctx.lineTo(left + width - yTickLength, canvasY)
    ctx.stroke()

    if (renderYTick) {
      ctx.fillText(
        renderYTick(y),
        left + width - yTickLength - TICK_TEXT_PADDING,
        canvasY
      )
    }
  } else if (yAxisAlign == "right") {
    ctx.beginPath()
    ctx.moveTo(left, canvasY)
    ctx.lineTo(left + yTickLength, canvasY)
    ctx.stroke()

    if (renderYTick) {
      ctx.fillText(
        renderYTick(y),
        left + yTickLength + TICK_TEXT_PADDING,
        canvasY
      )
    }
  }
}

interface Line {
  yLineColor: string
  yMax: number
  yMin: number
}

function drawLine(ctx: CanvasContext, layout: Layout, line: Line, y: number) {
  const {
    graph: { top, left, height, width },
  } = layout
  const { yLineColor, yMax, yMin } = line

  const canvasY = getCanvasY(height, top, yMax, yMin, y)

  ctx.strokeStyle = yLineColor

  ctx.beginPath()
  ctx.moveTo(left, canvasY)
  ctx.lineTo(left + width, canvasY)
  ctx.stroke()
}

export function draw(ctx: CanvasContext, layout: Layout, yAxis: YAxis) {
  const {
    yAxis: { top, left, height, width },
  } = layout

  const {
    showYLine,
    yAxisAlign,
    yAxisLineColor,
    yTicks,
    yTickInterval,
    yMin,
    yMax,
  } = yAxis

  // style y axis line
  ctx.lineWidth = 1
  ctx.strokeStyle = yAxisLineColor

  if (yAxisAlign == "left") {
    ctx.beginPath()
    ctx.moveTo(left + width, top)
    ctx.lineTo(left + width, top + height)
    ctx.stroke()
  } else if (yAxisAlign == "right") {
    ctx.beginPath()
    ctx.moveTo(left, top)
    ctx.lineTo(left, top + height)
    ctx.stroke()
  }

  if (yTickInterval > 0) {
    const y0 = stepBelow(yMin, yTickInterval)

    for (let y = y0; y <= yMax; y += yTickInterval) {
      if (y < yMin) {
        continue
      }

      drawTick(ctx, layout, yAxis, y)

      if (showYLine) {
        drawLine(ctx, layout, yAxis, y)
      }
    }
  }

  for (const y of yTicks) {
    if (y < yMin || yMax < y) {
      continue
    }

    drawTick(ctx, layout, yAxis, y)

    if (showYLine) {
      drawLine(ctx, layout, yAxis, y)
    }
  }
}
