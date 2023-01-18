export type CanvasContext = CanvasRenderingContext2D

export interface Context {
  axes: CanvasRenderingContext2D | null | undefined
  graph: CanvasRenderingContext2D | null | undefined
  ui: CanvasRenderingContext2D | null | undefined
}

export interface Point {
  x: number
  y: number
}

export interface Range {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

export interface Box {
  top: number
  left: number
  height: number
  width: number
}

export interface Layout {
  graph: Box
  yAxis: Box
  xAxis: Box
}

export type XAxisAlign = "top" | "bottom"
export type YAxisAlign = "left" | "right"
export type TextAlign = "left" | "right"

export interface XAxis {
  xAxisAlign: XAxisAlign
  xAxisLineColor: string
  xTicks: number[]
  xTickInterval: number
  showXLine: boolean
  xMin: number
  xMax: number
  xAxisFont: string
  xAxisTextColor: string
  xTickLength: number
  renderXTick?: (x: number) => string
  xLineColor: string
}

export interface YAxis {
  showYLine: boolean
  yAxisAlign: YAxisAlign
  yAxisLineColor: string
  yTicks: number[]
  yTickInterval: number
  yAxisFont: string
  yAxisTextColor: string
  yMin: number
  yMax: number
  yTickLength: number
  renderYTick?: (y: number) => string
  yLineColor: string
}

export interface Crosshair {
  canvasX: number
  canvasY: number
  xLineColor: string
  xLineWidth: number
  yLineColor: string
  yLineWidth: number
}

export interface XLabel {
  x?: number
  width: number
  height: number
  backgroundColor: string
  color: string
  font: string
  textPadding: number
  render?: (x?: number) => string
  drawLine: boolean
  lineWidth: number
  lineColor: string
}

export interface YLabel {
  y?: number
  width: number
  height: number
  backgroundColor: string
  color: string
  font: string
  textPadding: number
  render?: (y?: number) => string
  drawLine: boolean
  lineWidth: number
  lineColor: string
}

export interface Bar {
  x: number
  y: number
}

export interface BarGraph {
  data: Bar[]
  step: number
  getBarColor: (bar: Bar) => string
  barWidth: number
}

export interface LineGraph {
  data: Point[]
  step: number
  lineColor: string
}

export interface PointGraph {
  data: Point[]
  color: string
  radius: number
  ambientColor: string
  ambientRadius: number
}

interface BarGraphType extends Partial<BarGraph> {
  type: "bar"
}

interface LineGraphType extends Partial<LineGraph> {
  type: "line"
}

interface PointGraphType extends Partial<PointGraph> {
  type: "point"
}

export type Graph = BarGraphType | LineGraphType | PointGraphType
