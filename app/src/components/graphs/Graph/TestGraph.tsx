import React from "react"
import Graph from "./index"

const t0 = Math.floor(new Date().getTime() / 1000)

const DATA: { x: number; y: number }[][] = []
for (let i = 0; i < 3; i++) {
  DATA.push([])
  for (let j = 0; j < 150; j++) {
    const t = t0 + j * 1000
    // const date = new Date(t * 1000)
    const score = (DATA[i][j - 1]?.y || 0) + 100
    DATA[i].push({
      x: t,
      y: score,
      //   date,
      //   t,
      //   score,
    })
  }
}

const Y_MIN = DATA[0][0].y
const Y_MAX = DATA[0][149].y
const X_MIN = DATA[0][0].x
const X_MAX = DATA[0][149].x

interface Props {}

const TestGraph: React.FC<Props> = ({}) => {
  const range = {
    xMin: X_MIN,
    xMax: X_MAX,
    yMin: Y_MIN,
    yMax: Y_MAX,
  }
  return (
    <Graph
      width={600}
      height={400}
      backgroundColor="beige"
      range={range}
      xAxis={{
        xTickInterval: 24 * 3600,
        renderXTick: (x: number) =>
          new Date(x * 1000).toISOString().slice(0, 10),
      }}
      yAxis={{
        yTickInterval: 1000,
      }}
      graphs={[
        {
          type: "line",
          lineColor: "green",
          step: 1,
          data: DATA[0],
        },
        {
          type: "line",
          lineColor: "orange",
          step: 1,
          data: DATA[1],
        },
        {
          type: "point",
          data: DATA[2],
        },
        {
          type: "bar",
          data: DATA[2],
        },
      ]}
    />
  )
}

export default TestGraph
