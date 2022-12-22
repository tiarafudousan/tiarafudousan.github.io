import React, { useRef, useEffect } from "react"
import { draw, Context } from "./canvas"

function render(x: number): string {
  return x.toString()
}

interface Refs {
  axes: HTMLCanvasElement | null
  graph: HTMLCanvasElement | null
}

interface Props {
  width: number
  height: number
  xMin: number
  xMax: number
}

const GradientBar: React.FC<Props> = ({ width, height, xMin, xMax }) => {
  const refs = useRef<Refs>({ axes: null, graph: null })
  const ctx = useRef<Context>({ axes: null, graph: null })

  useEffect(() => {
    ctx.current.axes = refs.current.axes?.getContext("2d")
    ctx.current.graph = refs.current.graph?.getContext("2d")

    if (ctx.current) {
      draw(ctx.current, { width, height, xMin, xMax, render })
    }
  }, [])

  return (
    <div style={{ position: "relative", width, height }}>
      <canvas
        ref={(ref) => (refs.current.axes = ref)}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={(ref) => (refs.current.graph = ref)}
        style={{ position: "absolute", top: 0, left: 0 }}
        width={width}
        height={height}
      ></canvas>
    </div>
  )
}

export default GradientBar
