import React, { useRef, useEffect } from "react"
import { draw, Context } from "./canvas"

interface Refs {
  axes: HTMLCanvasElement | null
  graph: HTMLCanvasElement | null
  ui: HTMLCanvasElement | null
  // animation frame
  //   animation: number | null
  //   // NOTE: store props and layout as ref for animate to draw with latest prop
  //   props: null
  //   layout: null
}

interface Props {
  width: number
  height: number
  xs: number[]
  ys: number[]
  zs: number[][]
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  zMin: number
  zMax: number
  renderX: (x: number) => string
  renderY: (y: number) => string
  renderZ: (z: number) => string
}

const Graph: React.FC<Props> = ({
  width,
  height,
  xs,
  ys,
  zs,
  xMin,
  xMax,
  yMin,
  yMax,
  zMin,
  zMax,
  renderX,
  renderY,
  renderZ,
}) => {
  const refs = useRef<Refs>({ axes: null, graph: null, ui: null })
  const ctx = useRef<Context>({ axes: null, graph: null, ui: null })

  useEffect(() => {
    ctx.current.axes = refs.current.axes?.getContext("2d")
    ctx.current.graph = refs.current.graph?.getContext("2d")
    ctx.current.ui = refs.current.ui?.getContext("2d")

    if (ctx.current) {
      draw(ctx.current, {
        width,
        height,
        xs,
        ys,
        zs,
        xMin,
        xMax,
        yMin,
        yMax,
        zMin,
        zMax,
        renderX,
        renderY,
        renderZ,
      })
    }
  }, [zMin, zMax, zs])

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {}

  // TODO: background color

  return (
    <div
      style={{
        position: "relative",
        cursor: "crosshair",
        width,
        height,
        backgroundColor: "",
      }}
    >
      <canvas
        ref={(ref) => {
          refs.current.axes = ref
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.graph = ref
        }}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => {
          refs.current.ui = ref
        }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
        }}
        width={width}
        height={height}
        onMouseMove={onMouseMove}
      ></canvas>
    </div>
  )
}

export default Graph
