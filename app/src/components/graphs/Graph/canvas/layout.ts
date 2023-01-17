import { XAxisAlign, YAxisAlign, Box, Layout } from "./types"

interface Params {
  padding: number
  width: number
  height: number
  xAxisAlign: XAxisAlign
  xAxisHeight: number
  yAxisAlign: YAxisAlign
  yAxisWidth: number
}

export function getLayout(params: Params): Layout {
  const {
    padding,
    width,
    height,
    xAxisAlign,
    xAxisHeight,
    yAxisAlign,
    yAxisWidth,
  } = params

  return {
    graph: {
      top: xAxisAlign == "top" ? padding + xAxisHeight : padding,
      left: yAxisAlign == "left" ? padding + yAxisWidth : padding,
      width: width - 2 * padding - yAxisWidth,
      height: height - 2 * padding - xAxisHeight,
    },
    xAxis: {
      top: xAxisAlign == "top" ? padding : height - padding - xAxisHeight,
      left: yAxisAlign == "left" ? padding + yAxisWidth : padding,
      width: width - 2 * padding - yAxisWidth,
      height: xAxisHeight,
    },
    yAxis: {
      top: xAxisAlign == "top" ? padding + xAxisHeight : padding,
      left: yAxisAlign == "left" ? padding : width - padding - yAxisWidth,
      width: yAxisWidth,
      height: height - 2 * padding - xAxisHeight,
    },
  }
}
