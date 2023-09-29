import React from "react"
import Graph from "./Graph"
import { LineGraphType, Point } from "./Graph/canvas/types"

export function xy(arr: number[], x0 = 0, y0 = 0): Point[] {
  return arr.map((y, x) => ({
    x: x + x0,
    y: y + y0,
  }))
}

interface Props {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  data: Point[][]
  colors: string[]
}

const LineGraph: React.FC<Props> = ({
  xMin,
  xMax,
  yMin,
  yMax,
  data,
  colors,
}) => {
  const range = {
    xMin,
    xMax,
    yMin,
    yMax,
  }

  const xTickInterval = 1
  const yTickInterval = Math.max(Math.floor((yMax - yMin) / (8 * 10)) * 10, 10)

  const graphs: LineGraphType[] = data.map((d, i) => ({
    type: "line",
    lineColor: colors[i],
    lineWidth: 2,
    step: 1,
    data: d,
  }))

  return (
    <div>
      <Graph
        width={800}
        height={300}
        backgroundColor="beige"
        animate={true}
        range={range}
        xAxis={{
          xAxisHeight: 22,
          xTickInterval,
          xAxisLineColor: "black",
          xAxisTextColor: "black",
          xLineColor: "grey",
        }}
        yAxis={{
          yAxisWidth: 44,
          yTickInterval,
          yAxisLineColor: "black",
          yAxisTextColor: "black",
        }}
        graphs={graphs}
      />
    </div>
  )
}

export default LineGraph
