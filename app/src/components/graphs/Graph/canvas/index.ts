import {
  CanvasContext,
  Context,
  XAxisAlign,
  YAxisAlign,
  Point,
  Layout,
  Crosshair,
  XLabel,
  YLabel,
  GraphType,
} from "./types"

import * as xAxis from "../canvas/x-axis"
import * as yAxis from "../canvas/y-axis"
import * as line from "../canvas/line"
// import * as crosshair from "../canvas/crosshair"

export interface Params {
  width: number
  height: number
  padding: number
  backgroundColor: string
  animate?: boolean
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  // x axis
  xAxisAlign: XAxisAlign
  xAxisHeight: number
  xAxisLineColor: string
  xTicks: number[]
  xTickInterval: number
  xTickLength: number
  renderXTick: (x: number) => string
  xAxisFont: string
  xAxisTextColor: string
  showXLine: boolean
  xLineColor: string
  // y axis
  yAxisAlign: YAxisAlign
  yAxisWidth: number
  yAxisLineColor: string
  yTicks: number[]
  yTickInterval: number
  yTickLength: number
  renderYTick: (y: number) => string
  yAxisFont: string
  yAxisTextColor: string
  showYLine: boolean
  yLineColor: string
  // graphs
  graphs: GraphType[]
  frames: Partial<Text>[]
  xLabels: Partial<XLabel>[]
  yLabels: Partial<YLabel>[]
  crosshair?: Partial<Crosshair>
  onMouseMove?: (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    mouse: Point,
    layout: Layout
  ) => void
}

function _drawGraph(
  ctx: CanvasContext,
  layout: Layout,
  graph: GraphType,
  params: Params
) {
  switch (graph.type) {
    case "line":
      line.draw(ctx, layout, graph, params)
      return
    case "bar":
    case "point":
      return

    default:
      return
  }
}

export function draw(ctx: Context, layout: Layout, params: Params) {
  const { width, height } = params

  ctx.axes?.clearRect(0, 0, width, height)
  ctx.graph?.clearRect(0, 0, width, height)
  ctx.ui?.clearRect(0, 0, width, height)

  if (ctx.axes) {
    // TODO: optional xAxis and yAxis
    xAxis.draw(ctx.axes, layout, params)
    yAxis.draw(ctx.axes, layout, params)
  }

  if (ctx.graph) {
    for (const graph of params.graphs) {
      _drawGraph(ctx.graph, layout, graph, params)
    }
  }

  // if (params.crosshair) {
  //   crosshair.draw(ctx.ui, layout, params.crosshair)
  // }

  // for (const frame of params.frames) {
  //   text.draw(ctx.ui, frame)
  // }

  // for (const label of params.xLabels) {
  //   xLabel.draw(ctx.ui, layout, label, params)
  // }

  // for (const label of params.yLabels) {
  //   yLabel.draw(ctx.ui, layout, label, params)
  // }
}
