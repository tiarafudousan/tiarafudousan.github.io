import {
  CanvasContext,
  Context,
  XAxis,
  YAxis,
  XAxisAlign,
  YAxisAlign,
  Point,
  Layout,
  Range,
  Crosshair,
  XLabel,
  YLabel,
  Graph as GraphType,
} from "./types"

import * as xAxis from "../canvas/x-axis"
import * as yAxis from "../canvas/y-axis"
import * as bar from "../canvas/bar"
import * as line from "../canvas/line"
import * as point from "../canvas/point"
import * as crosshair from "../canvas/crosshair"

export interface Params {
  width: number
  height: number
  padding: number
  backgroundColor: string
  animate?: boolean
  range: Range
  // x axis
  xAxis: XAxis
  yAxis: YAxis
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
  range: Range,
  graph: GraphType
) {
  switch (graph.type) {
    case "bar":
      bar.draw(ctx, layout, range, graph)
      return
    case "line":
      line.draw(ctx, layout, range, graph)
      return
    case "point":
      point.draw(ctx, layout, range, graph)
      return
    default:
      return
  }
}

export function draw(ctx: Context, layout: Layout, params: Params) {
  const { width, height, range } = params

  ctx.axes?.clearRect(0, 0, width, height)
  ctx.graph?.clearRect(0, 0, width, height)
  ctx.ui?.clearRect(0, 0, width, height)

  if (ctx.axes) {
    // TODO: optional xAxis and yAxis
    xAxis.draw(ctx.axes, layout, range, params.xAxis)
    yAxis.draw(ctx.axes, layout, range, params.yAxis)
  }

  if (ctx.graph) {
    for (const graph of params.graphs) {
      _drawGraph(ctx.graph, layout, range, graph)
    }
  }

  if (ctx.ui) {
    if (params.crosshair) {
      crosshair.draw(ctx.ui, layout, params.crosshair)
    }
  }

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
