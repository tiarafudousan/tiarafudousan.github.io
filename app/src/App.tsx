import React, { useState, useRef, useEffect } from "react"
import "./App.css"
import { Inputs } from "./lib/form"
import { simulate, SimData } from "./lib/sim"
import { sim_fixed_rate_loan, FixedRateLoan } from "./lib/loan"
import { lerp, bound } from "./components/graphs/lib"
import Form from "./components/Form"
import LineGraph, { xy } from "./components/graphs/LineGraph"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"
import Range from "./components/Range"
import Select from "./components/Select"

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

const YEARS = 30

function App() {
  const ref = useRef(null)
  const [canvasSize, setCanvasSize] = useState(0)

  const [zType, setDataType] = useState<ZType>("roi")
  const [minZ, setMinZ] = useState(DEFAULT_Z)
  const [res, setSimData] = useState<SimData | null>(null)
  const [loanSim, setLoanSim] = useState<FixedRateLoan | null>(null)
  const [data, setHeatMapData] = useState<HeatMapData | null>(null)

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      const w = ref.current.offsetWidth
      setCanvasSize(bound(w, MIN_GRAPH_WIDTH, MAX_GRAPH_WIDTH))
    }
  }, [])

  // useEffect(() => {
  //   const values = {
  //     principal: 2000,
  //     years: 10,
  //     interest_rate: 5,
  //   }
  //   const principal = Math.floor(values.principal)
  //   const n = values.years * 12
  //   const interest_rate = values.interest_rate / (100 * 12)
  //   const loan_sim = sim_fixed_rate_loan(principal, interest_rate, n)
  //   setLoanSim(loan_sim)
  // }, [])

  function onSubmit(values: Inputs<number>) {
    const res = simulate(values)
    setSimData(res)

    console.log("SIM", res)

    // const principal = Math.floor(values.principal)
    // const n = values.years * 12
    // const interest_rate = values.interest_rate / (100 * 12)
    // const loan_sim = sim_fixed_rate_loan(principal, interest_rate, n)
    // setLoanSim(loan_sim)
    return

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
    setLoanSim(null)
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

  function onChangeDataType(value: string) {
    setDataType(value as ZType)
  }

  // TODO: mobile
  return (
    <div ref={ref} className="flex flex-row items-start max-w-[800px]">
      {loanSim != null ? (
        <LineGraph
          xMin={1}
          xMax={YEARS}
          yMin={0}
          yMax={300}
          data={[
            xy(loanSim.principals, 1, 0),
            xy(loanSim.interests, 1, 0),
            xy(loanSim.debt_repayments, 1, 0),
          ]}
          colors={["blue", "orange", "red"]}
        />
      ) : null}
      <div className="h-screen overflow-y-auto px-6 py-6">
        <Form onSubmit={onSubmit} onReset={onReset} />
      </div>

      {res != null ? (
        <div className="px-6 py-6 min-w-[300px]">
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
                <td>返済総額</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.total_debt_payment)} 円
                </td>
              </tr>
              <tr>
                <td>収入 (月)</td>
                <td style={{ textAlign: "right" }}>{Yen(res.noi / 12)} 円</td>
              </tr>
              <tr>
                <td>返済額 (月)</td>
                <td style={{ textAlign: "right" }}>{Yen(res.ads / 12)} 円</td>
              </tr>
              <tr>
                <td>返済比率</td>
                <td style={{ textAlign: "right" }}>
                  {Percent(res.egi > 0 ? res.ads / res.egi : 1)} %
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
                <td>固定資産税 (土地)</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.property_tax_land)} 円
                </td>
              </tr>
              <tr>
                <td>固定資産税 (建物)</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.property_tax_building)} 円
                </td>
              </tr>
              <tr>
                <td>都市計画税 (土地)</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.city_planning_tax_land)} 円
                </td>
              </tr>
              <tr>
                <td>都市計画税 (建物)</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.city_planning_tax_building)} 円
                </td>
              </tr>
              <tr>
                <td>OPEX</td>
                <td style={{ textAlign: "right" }}>{Yen(res.opex)} 円</td>
              </tr>
              <tr>
                <td>NOI</td>
                <td style={{ textAlign: "right" }}>{Yen(res.noi)} 円</td>
              </tr>
              <tr>
                <td>ADS</td>
                <td style={{ textAlign: "right" }}>{Yen(res.ads)} 円</td>
              </tr>
              <tr>
                <td>BTCF</td>
                <td style={{ textAlign: "right" }}>{Yen(res.btcf)} 円</td>
              </tr>
              <tr>
                <td>減価償却 (建物)</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.building_depreciation)} 円
                </td>
              </tr>
              <tr>
                <td>減価償却年数 (建物)</td>
                <td style={{ textAlign: "right" }}>
                  {res.building_depreciation_period} 年
                </td>
              </tr>
              <tr>
                <td>元金返済</td>
                <td style={{ textAlign: "right" }}>{Yen(res.principal)} 円</td>
              </tr>
              <tr>
                <td>申告所得</td>
                <td style={{ textAlign: "right" }}>
                  {Yen(res.taxable_income)} 円
                </td>
              </tr>
              <tr>
                <td>税金</td>
                <td style={{ textAlign: "right" }}>{Yen(res.tax)} 円</td>
              </tr>
              <tr>
                <td>ATCF</td>
                <td style={{ textAlign: "right" }}>{Yen(res.atcf)} 円</td>
              </tr>
              <tr>
                <td>K</td>
                <td style={{ textAlign: "right" }}>{Percent(res.k)} %</td>
              </tr>
              <tr>
                <td>FCR</td>
                <td style={{ textAlign: "right" }}>{Percent(res.fcr)} %</td>
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
          <Select
            value={zType}
            onChange={onChangeDataType}
            options={[
              { value: "roi", text: "返済後利回り" },
              { value: "ccr", text: "CCR" },
            ]}
          />
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
