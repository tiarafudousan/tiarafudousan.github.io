export type CanvasContext = CanvasRenderingContext2D

export interface Graph {
  top: number
  left: number
  width: number
  height: number
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

export type XAxisAt = "top" | "bottom"
export type YAxisAt = "left" | "right"
export type TextAlign = "left" | "right"

export interface Point {
  x: number
  y: number
}
