import {
  XAxisAlign,
  YAxisAlign,
  Point,
  Layout,
  Crosshair,
  XLabel,
  YLabel,
  Graph,
} from "./types"

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
  graphs: Graph[]
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

export function draw() {}
