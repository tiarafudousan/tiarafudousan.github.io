import { GRADIENTS } from "../config"
import { lerp, lin, bound } from "../lib"

// gradients 100 (r, g, b, a) numbers
const G = 100

const GRAPH_PADDING_LEFT = 60
const GRAPH_PADDING_RIGHT = 20
const GRAPH_Y_PADDING = 20
const GRAPH_X_LABEL_PADDING_TOP = 10
const GRAPH_Y_LABEL_PADDING_RIGHT = 10

export interface Context {
  axes: CanvasRenderingContext2D | null | undefined
  graph: CanvasRenderingContext2D | null | undefined
}

interface Params {
  width: number
  height: number
  xs: number[]
  ys: number[]
  zs: number[][]
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zMin: number
  zMax: number
  renderX: (x: number) => string
  renderY: (y: number) => string
  renderZ: (z: number) => string
}

export function draw(ctx: Context, params: Params) {
  if (!ctx.axes || !ctx.graph) {
    return
  }

  const {
    width,
    height,
    xs,
    ys,
    zs,
    xMin,
    xMax,
    yMin,
    yMax,
    zMin,
    zMax,
    renderX,
    renderY,
    renderZ,
  } = params

  // Calculations
  const graphWidth = width - (GRAPH_PADDING_LEFT + GRAPH_PADDING_RIGHT)
  const graphHeight = height - 2 * GRAPH_Y_PADDING

  const graphX0 = GRAPH_PADDING_LEFT
  const graphX1 = GRAPH_PADDING_LEFT + graphWidth
  const graphY0 = GRAPH_Y_PADDING
  const graphY1 = GRAPH_Y_PADDING + graphHeight

  const dx = xMax - xMin
  const dy = yMax - yMin
  const dz = zMax - zMin

  const boxWidth = Math.round((graphX1 - graphX0) / xs.length)
  const boxHeight = Math.round((graphY1 - graphY0) / xs.length)

  // Get gradient data
  const gradient = ctx.graph.createLinearGradient(0, 0, 0, G)
  for (const grad of GRADIENTS) {
    gradient.addColorStop(grad.value, grad.color)
  }
  ctx.graph.fillStyle = gradient
  ctx.graph.fillRect(0, 0, 1, G)
  const rgba = ctx.graph.getImageData(0, 0, 1, G).data

  // Clear
  ctx.axes.clearRect(0, 0, width, height)
  ctx.graph.clearRect(0, 0, width, height)

  // Draw x labels
  ctx.axes.fillStyle = "black"
  ctx.axes.textAlign = "center"
  ctx.axes.textBaseline = "middle"

  for (const x of xs) {
    const t = lin(1, dx, x - xMin, 0)
    const canvasX = lerp(graphX0 + boxWidth / 2, graphX1 - boxWidth / 2, t)
    const canvasY = graphY1 + GRAPH_X_LABEL_PADDING_TOP
    ctx.axes.fillText(renderX(x), canvasX, canvasY)
  }

  // Draw y labels
  ctx.axes.textAlign = "right"
  ctx.axes.textBaseline = "middle"

  for (const y of ys) {
    const t = lin(1, dy, y - yMin, 0)
    const canvasX = GRAPH_PADDING_LEFT - GRAPH_Y_LABEL_PADDING_RIGHT
    const canvasY = lerp(graphY1 - boxHeight / 2, graphY0 + boxHeight / 2, t)
    ctx.axes.fillText(renderY(y), canvasX, canvasY)
  }

  // Draw heat map
  ctx.graph.textAlign = "center"
  ctx.graph.textBaseline = "middle"

  // i, j = column i, row j
  for (let i = 0; i < xs.length; i++) {
    for (let j = 0; j < ys.length; j++) {
      const canvasX = graphX0 + i * boxWidth
      const canvasY = graphY0 + j * boxHeight

      // Linear map z to color
      const z = zs[i][j]
      const c = bound(
        Math.floor(lin(G - 1, dz, z - zMin, 0)) * 4,
        0,
        4 * (G - 1)
      )

      const r = rgba[c]
      const g = rgba[c + 1]
      const b = rgba[c + 2]
      const a = rgba[c + 3]
      const color = `rgba(${r},${g},${b},${a})`

      ctx.graph.fillStyle = color
      ctx.graph.fillRect(canvasX, canvasY, boxWidth, boxHeight)

      ctx.graph.fillStyle = c < 2 * G ? "white" : "black"
      ctx.graph.fillText(
        renderZ(z),
        canvasX + boxWidth / 2,
        canvasY + boxHeight / 2
      )
    }
  }
}
