import React, { useRef, useEffect } from "react"
import { draw } from "./canvas"
import { getLayout } from "./canvas/layout"
import {
  Context,
  Point,
  Layout,
  Range,
  XAxis,
  YAxis,
  XAxisAlign,
  YAxisAlign,
  XLabel,
  YLabel,
  Crosshair,
  Graph as GraphType,
} from "./canvas/types"

export interface Props {
  width: number
  height: number
  padding: number
  backgroundColor: string
  animate?: boolean
  range: Range
  xAxis: Partial<XAxis>
  yAxis: Partial<YAxis>
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

interface GraphParams extends Props {
  xAxis: XAxis
  yAxis: YAxis
}

const DEFAULT_PARAMS: GraphParams = {
  width: 500,
  height: 300,
  padding: 10,
  backgroundColor: "",
  animate: false,
  range: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
  xAxis: {
    xAxisAlign: "bottom" as XAxisAlign,
    xAxisHeight: 30,
    xAxisLineColor: "black",
    xTicks: [],
    xTickInterval: 0,
    xTickLength: 10,
    renderXTick: (x: number) => x.toString(),
    xAxisFont: "",
    xAxisTextColor: "black",
    showXLine: true,
    xLineColor: "lightgrey",
  },
  yAxis: {
    yAxisAlign: "left" as YAxisAlign,
    yAxisWidth: 50,
    yAxisLineColor: "black",
    yTicks: [],
    yTickInterval: 0,
    yTickLength: 10,
    renderYTick: (y: number) => y.toString(),
    yAxisFont: "",
    yAxisTextColor: "black",
    showYLine: true,
    yLineColor: "lightgrey",
  },
  // graphs
  graphs: [],
  frames: [],
  xLabels: [],
  yLabels: [],
}

function withDefaultParams(props: Partial<Props>): GraphParams {
  return {
    ...DEFAULT_PARAMS,
    ...props,
    xAxis: {
      ...DEFAULT_PARAMS.xAxis,
      ...props?.xAxis,
    },
    yAxis: {
      ...DEFAULT_PARAMS.yAxis,
      ...props?.yAxis,
    },
  }
}

interface Refs {
  axes: HTMLCanvasElement | null
  graph: HTMLCanvasElement | null
  ui: HTMLCanvasElement | null
  // animation frame
  //   animation: number | null
  //   // NOTE: store props and layout as ref for animate to draw with latest prop
  //   props: null
  //   layout: null
}

const Graph: React.FC<Partial<Props>> = (props) => {
  const params = withDefaultParams(props)
  const { width, height, backgroundColor = "" } = params

  const refs = useRef<Refs>({ axes: null, graph: null, ui: null })
  const ctx = useRef<Context>({ axes: null, graph: null, ui: null })

  useEffect(() => {
    ctx.current.axes = refs.current.axes?.getContext("2d")
    ctx.current.graph = refs.current.graph?.getContext("2d")
    ctx.current.ui = refs.current.ui?.getContext("2d")

    if (ctx.current) {
      const layout = getLayout(params)
      draw(ctx.current, layout, params)
    }
  }, [])

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {}

  return (
    <div
      style={{
        position: "relative",
        cursor: "crosshair",
        width,
        height,
        backgroundColor,
      }}
    >
      <canvas
        ref={(ref) => {
          refs.current.axes = ref
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.graph = ref
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.ui = ref
        }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
        width={width}
        height={height}
        onMouseMove={onMouseMove}
      ></canvas>
    </div>
  )
}

export default Graph
