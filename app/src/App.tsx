import React, { useState, useRef, useEffect } from "react"
import "./App.css"
import { Inputs } from "./lib/form"
import { simulate, SimData } from "./lib/sim"
import { lerp, bound } from "./components/graphs/lib"
import Form from "./components/Form"
import LineGraph from "./components/graphs/LineGraph"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"
import Range from "./components/Range"

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

const TOTAL_INVESTMENT_DELTA = 0.05
const TARGET_ROI = 2
const MAX_ROI = 20
const TARGET_CCR = 30
const MAX_CCR = 100

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

const MIN_GRAPH_WIDTH = 350
const MAX_GRAPH_WIDTH = 600

interface HeatMapData {
  yMin: number
  yMax: number
  ys: number[]
  roi: {
    zMin: number
    zMax: number
    zs: number[][]
  }
  ccr: {
    zMin: number
    zMax: number
    zs: number[][]
  }
}

function Yen(value: number): string {
  return Math.round(value * 10000).toLocaleString()
}

function Percent(value: number): string {
  return (value * 100).toFixed(2)
}

type ZType = "roi" | "ccr"

const DEFAULT_Z = {
  roi: TARGET_ROI,
  ccr: TARGET_CCR,
}

function App() {
  const ref = useRef(null)
  const [canvasSize, setCanvasSize] = useState(0)

  const [zType, setDataType] = useState<ZType>("roi")
  const [minZ, setMinZ] = useState(DEFAULT_Z)
  const [res, setSimData] = useState<SimData | null>(null)
  const [data, setHeatMapData] = useState<HeatMapData | null>(null)

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      const w = ref.current.offsetWidth
      setCanvasSize(bound(w, MIN_GRAPH_WIDTH, MAX_GRAPH_WIDTH))
    }
  }, [])

  function onSubmit(values: Inputs<number>) {
    const res = simulate(values)
    setSimData(res)

    const total_cash_in = res.total_cash_in
    const yMax = total_cash_in
    const yMin = total_cash_in * (1 - 10 * TOTAL_INVESTMENT_DELTA)

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

    let zMin = { roi: 0, ccr: 0 }
    let zMax = { roi: 0, ccr: 0 }

    // i, j = column i, row j
    const zs = { roi: [] as number[][], ccr: [] as number[][] }
    for (let i = 0; i <= 10; i++) {
      zs.roi.push([])
      zs.ccr.push([])

      for (let j = 0; j <= 10; j++) {
        const total = total_cash_in * (1 - j * TOTAL_INVESTMENT_DELTA)
        const cash = (total * i) / 10

        const res = simulate({
          ...values,
          cash,
          principal: total - cash,
        })

        const roi = res.real_yield * 100
        const ccr = res.ccr * 100

        zMax.roi = Math.max(zMax.roi, roi)
        zMax.ccr = Math.max(zMax.ccr, ccr)
        zMin.roi = Math.min(zMin.roi, roi)
        zMax.ccr = Math.max(zMax.ccr, ccr)

        zs.roi[i].push(roi)
        zs.ccr[i].push(ccr)
      }
    }

    zMax.roi = minZ.roi
    zMax.ccr = minZ.ccr

    setHeatMapData((state) => ({
      ...state,
      yMax,
      yMin,
      ys,
      roi: {
        zMin: zMin.roi,
        zMax: zMax.roi,
        zs: zs.roi,
      },
      ccr: {
        zMin: zMin.ccr,
        zMax: zMax.ccr,
        zs: zs.ccr,
      },
    }))
  }

  function onReset() {
    setHeatMapData(null)
    setSimData(null)
    setMinZ(DEFAULT_Z)
  }

  function onChangeMinZ(value: number) {
    setMinZ((state) => ({
      ...state,
      [zType]: value,
    }))

    setHeatMapData((state) => {
      if (state) {
        return {
          ...state,
          [zType]: {
            ...state[zType],
            zMax: value,
          },
        }
      }
      return null
    })
  }

  function onChangeDataType(e: React.ChangeEvent<HTMLSelectElement>) {
    setDataType(e.target.value as ZType)
  }

  // TODO: mobile
  return (
    <div
      ref={ref}
      className="flex flex-col items-center py-10 mx-auto max-w-[800px]"
    >
      <Form onSubmit={onSubmit} onReset={onReset} />

      {res != null ? (
        <div className="mt-8 min-w-[300px]">
          <div className="text-xl font-semibold mb-2">収支試算</div>
          <table className="w-full">
            <tbody>
              <tr>
                <td>総投資額</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.total_cash_in)} 円
                </td>
              </tr>
              <tr>
                <td>表面利回り</td>
                <td style={{ textAlign: "right" }}>
                  {Percent(res.gross_yield)} %
                </td>
              </tr>
              <tr>
                <td>GPI</td>
                <td style={{ textAlign: "right" }}>{Yen(res.gpi)} 円</td>
              </tr>
              <tr>
                <td>EGI</td>
                <td style={{ textAlign: "right" }}>{Yen(res.egi)} 円</td>
              </tr>
              <tr>
                <td>返済総額</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.total_debt_payment)} 円
                </td>
              </tr>
              <tr>
                <td>返済額（月）</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.monthly_debt_payment)} 円
                </td>
              </tr>
              <tr>
                <td>収入（月）</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.monthly_cash_in)} 円
                </td>
              </tr>
              <tr>
                <td>返済比率</td>
                <td style={{ textAlign: "right" }}>
                  {Percent(res.monthly_repayment_ratio)} %
                </td>
              </tr>
              <tr>
                <td>手取り（年）</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.yearly_cash_flow)} 円
                </td>
              </tr>
              <tr>
                <td>返済後利回り</td>
                <td style={{ textAlign: "right" }}>
                  {Percent(res.real_yield)} %
                </td>
              </tr>
              <tr>
                <td>CCR</td>
                <td style={{ textAlign: "right" }}>{Percent(res.ccr)} %</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      {data != null ? (
        <div className="mt-8 flex flex-col items-center mx-auto">
          <select
            className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-md border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 p-2"
            value={zType}
            onChange={onChangeDataType}
          >
            <option value="roi">返済後利回り</option>
            <option value="ccr">CCR</option>
          </select>

          <GradientBar
            width={canvasSize}
            height={60}
            zMin={data[zType].zMin}
            zMax={data[zType].zMax}
            render={(z) => `${z.toFixed(2)} %`}
          />
          <Range
            label={zType == "roi" ? "返済後利回り" : "CCR"}
            min={0}
            max={zType == "roi" ? MAX_ROI : MAX_CCR}
            value={minZ[zType]}
            onChange={onChangeMinZ}
          />
          <HeatMap
            width={canvasSize}
            height={canvasSize}
            xs={XS}
            ys={data.ys}
            zs={data[zType].zs}
            xMin={X_MIN}
            xMax={X_MAX}
            yMin={data.yMin}
            yMax={data.yMax}
            zMin={data[zType].zMin}
            zMax={data[zType].zMax}
            renderX={renderX}
            renderY={renderY}
            renderZ={renderZ}
          />
          <div className="text-sm">X = 自己資金比率 Y = 総投資額</div>
        </div>
      ) : null}
    </div>
  )
}

export default App
