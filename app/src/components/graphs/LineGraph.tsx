import React from "react"
import Graph from "./Graph"
import { LineGraphType } from "./Graph/canvas/types"

interface Props {}

const LineGraph: React.FC<Props> = ({}) => {
  const xMin = 0
  const xMax = 30
  const yMin = 0
  const yMax = 100
  const range = {
    xMin,
    xMax,
    yMin,
    yMax,
  }

  const xTickInterval = 1
  const yTickInterval = Math.max(
    // Round to nearest 10
    Math.floor((yMax - yMin) / (8 * 10)) * 10,
    10,
  )

  const data = [
    [
      { x: 0, y: 100 },
      { x: 20, y: 30 },
    ],
  ]

  const graphs: LineGraphType[] = data.map((d, i) => ({
    type: "line",
    lineColor: "green",
    step: 1,
    data: d,
  }))

  return (
    <div>
      <Graph
        width={800}
        height={300}
        backgroundColor="white"
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
