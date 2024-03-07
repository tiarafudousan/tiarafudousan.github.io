import React, { useState } from "react"
import Graph from "./Graph"
import { BarGraphType, Point, Layout } from "./Graph/canvas/types"
import { isInside, findNearestIndex, getX, getY } from "./Graph/canvas/math"

const GRAPH_WIDTH = 1000
const GRAPH_HEIGHT = 150
const HOVER_WIDTH = 100
const HOVER_MARGIN = 20
const HOVER_HEIGHT = 22

interface Props {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  data: Point[][]
}

const BarGraph: React.FC<Props> = ({ xMin, xMax, yMin, yMax, data }) => {
  const [mouse, setMouse] = useState<Point | null>(null)
  const [hover, setHover] = useState<Point | null>(null)
  const [hoverData, setHoverData] = useState<Point | null>(null)

  const range = {
    xMin,
    xMax,
    yMin,
    yMax,
  }

  function onMouseMove(_: any, point: Point | null, layout: Layout) {
    if (!point) {
      return
    }

    const { graph } = layout

    if (!isInside(graph, point)) {
      setMouse(null)
      setHover(null)
      setHoverData(null)
      return
    }

    setMouse(point)

    const hoverLeft = point.x + HOVER_MARGIN + HOVER_WIDTH
    const hoverRight = point.x - HOVER_MARGIN - HOVER_WIDTH
    const hoverTop = point.y - HOVER_HEIGHT
    const hoverBottom = point.y + HOVER_HEIGHT

    setHover({
      x:
        hoverLeft < graph.left + graph.width
          ? point.x + HOVER_MARGIN
          : hoverRight,
      y: hoverBottom > graph.top + graph.height ? hoverTop : point.y,
    })

    const x = getX(graph.width, graph.left, xMax, xMin, point.x)

    if (data[0]) {
      const j = findNearestIndex(data[0], (p) => p.x + 0.5, x)
      const p = data[0][j]
      if (p) {
        setHoverData(p)
      }
    }
  }

  function onMouseOut() {
    setMouse(null)
    setHover(null)
    setHoverData(null)
  }

  const yTickInterval = Math.max(Math.floor((yMax - yMin) / (6 * 10)) * 10, 10)

  const graphs: BarGraphType[] = data.map((d, i) => ({
    type: "bar",
    step: 1,
    data: d,
    getBarColor: (bar) => {
      return bar.y >= 0 ? "green" : "red"
    },
    barWidth: 4,
    y0: yMin >= 0 ? yMin : 0,
  }))

  return (
    <div className="relative">
      <Graph
        width={GRAPH_WIDTH}
        height={GRAPH_HEIGHT}
        backgroundColor="beige"
        animate={true}
        range={range}
        xAxis={{
          xAxisHeight: 22,
          xTickInterval: 1,
          xAxisLineColor: "black",
          xAxisTextColor: "black",
          xLineColor: "grey",
          renderXTick: (x) => `${x + 1}`,
        }}
        yAxis={{
          yAxisWidth: 44,
          yTickInterval,
          yAxisLineColor: "black",
          yAxisTextColor: "black",
        }}
        crosshair={{
          point: mouse,
          showXLine: true,
          xLineColor: "black",
          xLineWidth: 0.5,
        }}
        graphs={graphs}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
      />
      {hover ? (
        <div
          className="absolute"
          style={{
            top: hover.y,
            left: hover.x,
            width: HOVER_WIDTH,
            height: HOVER_HEIGHT,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "black",
          }}
        >
          <div className="flex flex-row">
            BTCF
            <div
              style={{
                marginLeft: "auto",
                textAlign: "right",
                color: (hoverData?.y || 0) >= 0 ? "green" : "red",
              }}
            >
              {Math.floor(hoverData?.y || 0)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default BarGraph
