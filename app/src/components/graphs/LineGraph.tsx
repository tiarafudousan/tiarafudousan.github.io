import React, { useState } from "react"
import Circle from "../svg/Circle"
import Graph from "./Graph"
import {
  LineGraphType,
  PointGraphType,
  Point,
  Layout,
} from "./Graph/canvas/types"
import { isInside, findNearestIndex, getX, getY } from "./Graph/canvas/math"

const GRAPH_WIDTH = 1000
const GRAPH_HEIGHT = 260
const HOVER_WIDTH = 300
const HOVER_MARGIN = 20
const HOVER_HEIGHT = 168
const XS: number[] = Array.from(Array(30).keys())

interface Props {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  data: Point[][]
  colors: string[]
  ambientColors: string[]
  labels: string[]
}

const LineGraph: React.FC<Props> = ({
  xMin,
  xMax,
  yMin,
  yMax,
  data,
  colors,
  ambientColors,
  labels,
}) => {
  const [mouse, setMouse] = useState<Point | null>(null)
  const [hover, setHover] = useState<Point | null>(null)
  const [hoverData, setHoverData] = useState<Point[]>([])
  const [points, setPoints] = useState<PointGraphType[]>([])

  function onMouseMove(_: any, point: Point | null, layout: Layout) {
    if (!point) {
      return
    }

    const { graph } = layout

    if (!isInside(graph, point)) {
      setMouse(null)
      setHover(null)
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
    const j = Math.max(findNearestIndex(XS, x) - 1, 0)

    const hoverData: Point[] = []
    const points: PointGraphType[] = []
    for (let i = 0; i < data.length; i++) {
      const d = data[i][j]
      hoverData.push(d)
      points.push({
        type: "point",
        data: [{ x: d.x, y: d.y }],
        color: colors[i],
        radius: 3,
        ambientRadius: 8,
        ambientColor: ambientColors[i],
      })
    }

    setHoverData(hoverData)
    setPoints(points)
  }

  function onMouseOut() {
    setMouse(null)
    setHover(null)
    setHoverData([])
    setPoints([])
  }

  const range = {
    xMin,
    xMax,
    yMin,
    yMax,
  }

  const yTickInterval = Math.max(Math.floor((yMax - yMin) / (8 * 10)) * 10, 10)

  const graphs: LineGraphType[] = data.map((d, i) => ({
    type: "line",
    lineColor: colors[i],
    lineWidth: 2,
    step: 1,
    data: d,
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
        graphs={[...graphs, ...points]}
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
          {hoverData.map((d, i) => (
            <div className="flex flex-row items-center" key={i}>
              <Circle
                size={10}
                fill={true}
                color={colors[i]}
                className="mx-2"
              />
              <div className="flex flex-row">
                <div className="w-[80px]">{labels[i]}</div>
                <div className="truncate text-sm">{Math.floor(d.y)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default LineGraph
