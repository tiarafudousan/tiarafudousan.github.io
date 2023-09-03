import { GRADIENTS } from "../config"
import { lerp, lin } from "../lib"

const GRAPH_X_PADDING = 20
const GRAPH_Y_PADDING = 20
const GRAPH_LABEL_PADDING_TOP = 10

export interface Context {
  axes: CanvasRenderingContext2D | null | undefined
  graph: CanvasRenderingContext2D | null | undefined
}

interface Params {
  width: number
  height: number
  zMin: number
  zMax: number
  render: (x: number) => string
}

export function draw(ctx: Context, params: Params) {
  if (!ctx.axes || !ctx.graph) {
    return
  }

  const { width, height, zMin, zMax, render } = params

  const graphWidth = width - 2 * GRAPH_X_PADDING
  const graphHeight = height - 2 * GRAPH_Y_PADDING

  const graphX0 = GRAPH_X_PADDING
  const graphX1 = GRAPH_X_PADDING + graphWidth
  // const graphY0 = GRAPH_Y_PADDING
  const graphY1 = GRAPH_Y_PADDING + graphHeight

  ctx.axes.clearRect(0, 0, width, height)
  ctx.graph.clearRect(0, 0, width, height)

  // Draw x labels
  ctx.axes.fillStyle = "black"
  ctx.axes.textAlign = "center"
  ctx.axes.textBaseline = "middle"

  const dz = zMax - zMin
  const zs = [
    lerp(zMin, zMax, 0),
    lerp(zMin, zMax, 0.25),
    lerp(zMin, zMax, 0.5),
    lerp(zMin, zMax, 0.75),
    lerp(zMin, zMax, 1),
  ]

  for (let i = 0; i < zs.length; i++) {
    const z = zs[i]
    const t = lin(1, dz, z - zMin, 0)
    const canvasX = lerp(graphX0, graphX1, t)
    const canvasY = graphY1 + GRAPH_LABEL_PADDING_TOP
    ctx.axes.fillText(render(z), canvasX, canvasY)
  }

  // Draw graph
  const gradient = ctx.graph.createLinearGradient(0, 0, graphWidth, 0)
  for (let i = 0; i < GRADIENTS.length; i++) {
    const grad = GRADIENTS[i]
    gradient.addColorStop(grad.value, grad.color)
  }

  ctx.graph.fillStyle = gradient
  ctx.graph.roundRect(
    GRAPH_X_PADDING,
    GRAPH_Y_PADDING,
    graphWidth,
    graphHeight,
    4,
  )
  ctx.graph.fill()
}
