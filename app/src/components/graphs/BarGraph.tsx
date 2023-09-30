import React from "react"
import Graph from "./Graph"
import { BarGraphType, Point } from "./Graph/canvas/types"

interface Props {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  data: Point[][]
}

const BarGraph: React.FC<Props> = ({ xMin, xMax, yMin, yMax, data }) => {
  const range = {
    xMin,
    xMax,
    yMin,
    yMax,
  }

  const yTickInterval = Math.max(Math.floor((yMax - yMin) / (6 * 10)) * 10, 10)

  const graphs: BarGraphType[] = data.map((d, i) => ({
    type: "bar",
    step: 1,
    data: d,
    getBarColor: (bar) => (bar.y >= 0 ? "green" : "red"),
    barWidth: 4,
    y0: 0,
  }))

  return (
    <Graph
      width={800}
      height={150}
      backgroundColor="beige"
      animate={true}
      range={range}
      xAxis={{
        xAxisHeight: 22,
        xTickInterval: 1,
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
  )
}

export default BarGraph
