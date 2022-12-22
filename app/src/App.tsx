import React, { useState } from "react"
import "./App.css"
import { Inputs } from "./lib/form"
import { simulate } from "./lib/sim"
import { lerp } from "./components/graphs/lib"
import Form from "./components/Form"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"

// Heat map
function renderX(x: number): string {
  return `${x} %`
}

function renderY(y: number): string {
  return `${y} 万`
}

function renderZ(z: number): string {
  return z.toFixed(2)
}

const PRICE_DELTA = 0.05

const X_MIN = 0
const X_MAX = 100
const XS = [
  Math.floor(lerp(X_MIN, X_MAX, 0)),
  Math.floor(lerp(X_MIN, X_MAX, 0.1)),
  Math.floor(lerp(X_MIN, X_MAX, 0.2)),
  Math.floor(lerp(X_MIN, X_MAX, 0.3)),
  Math.floor(lerp(X_MIN, X_MAX, 0.4)),
  Math.floor(lerp(X_MIN, X_MAX, 0.5)),
  Math.floor(lerp(X_MIN, X_MAX, 0.6)),
  Math.floor(lerp(X_MIN, X_MAX, 0.7)),
  Math.floor(lerp(X_MIN, X_MAX, 0.8)),
  Math.floor(lerp(X_MIN, X_MAX, 0.9)),
  Math.floor(lerp(X_MIN, X_MAX, 1)),
]

// TODO:L zMax from input
const Z_MAX = 2

interface HeatMapData {
  ys: number[]
  zs: number[][]
  yMin: number
  yMax: number
  zMin: number
  zMax: number
}

function App() {
  const [data, setHeatMapData] = useState<HeatMapData | null>(null)

  function onSubmit(values: Inputs<number>) {
    const yMax = values.property_price
    const yMin = values.property_price * (1 - 10 * PRICE_DELTA)

    const ys = [
      lerp(yMin, yMax, 0),
      lerp(yMin, yMax, 0.1),
      lerp(yMin, yMax, 0.2),
      lerp(yMin, yMax, 0.3),
      lerp(yMin, yMax, 0.4),
      lerp(yMin, yMax, 0.5),
      lerp(yMin, yMax, 0.6),
      lerp(yMin, yMax, 0.7),
      lerp(yMin, yMax, 0.8),
      lerp(yMin, yMax, 0.9),
      lerp(yMin, yMax, 1),
    ]

    let zMin = 0
    let zMax = 0

    const zs: number[][] = []
    for (let i = 0; i <= 10; i++) {
      zs.push([])

      const price = values.property_price * (1 - i * PRICE_DELTA)
      for (let j = 0; j <= 10; j++) {
        const cash = (price * j) / 10

        // TODO: simulate when loan > property price
        const res = simulate({
          ...values,
          property_price: price,
          cash,
          loan: price - cash,
        })

        const z = res.yield_after_repayment * 100
        // const z = res.ccr * 100
        zMax = Math.max(zMax, z)
        zMin = Math.min(zMin, z)

        // TODO: ccr
        zs[i].push(z)
      }
    }

    zMax = Z_MAX

    setHeatMapData((state) => ({
      ...state,
      ys,
      zs,
      yMax,
      yMin,
      zMin,
      zMax,
    }))
  }

  function onReset() {
    setHeatMapData(null)
  }

  return (
    <div className="flex flex-col items-center py-10 mx-auto max-w-[800px]">
      <Form onSubmit={onSubmit} onReset={onReset} />

      {data != null ? (
        <div className="flex flex-col items-center">
          <GradientBar
            width={500}
            height={60}
            zMin={data.zMin}
            zMax={data.zMax}
            render={(z) => z.toFixed(2)}
          />
          <HeatMap
            width={600}
            height={600}
            xs={XS}
            ys={data.ys}
            zs={data.zs}
            xMin={X_MIN}
            xMax={X_MAX}
            yMin={data.yMin}
            yMax={data.yMax}
            zMin={data.zMin}
            zMax={data.zMax}
            renderX={renderX}
            renderY={renderY}
            renderZ={renderZ}
          />
          <div className="text-sm">X = 自己資金比率 Y = 物件価格</div>
        </div>
      ) : null}
    </div>
  )
}

export default App
