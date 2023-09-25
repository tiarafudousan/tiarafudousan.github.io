import React, { useState, useRef, useEffect } from "react"
import "./App.css"
import styles from "./App.module.css"
import { Inputs } from "./lib/form"
import { calc_cf, sim_cf, CashFlowData } from "./lib/cf"
import * as loan_lib from "./lib/loan"
import { FixedRateLoan } from "./lib/loan"
import { lerp, bound } from "./components/graphs/lib"
import Form from "./components/Form"
import LineGraph, { xy } from "./components/graphs/LineGraph"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"
import Range from "./components/Range"
import Select from "./components/Select"

const YEARS = 30

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
  const [sim, setSimData] = useState<CashFlowData | null>(null)
  const [heat, setHeatMapData] = useState<HeatMapData | null>(null)
  const [loanSimData, setLoanSimData] = useState<FixedRateLoan | null>(null)
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      const w = ref.current.offsetWidth
      setCanvasSize(bound(w, MIN_GRAPH_WIDTH, MAX_GRAPH_WIDTH))
    }
  }, [])

  function onSubmit(values: Inputs<number>) {
    const loan_sim = loan_lib.sim_fixed_rate_loan(
      values.principal,
      values.interest_rate / (100 * 12),
      values.years * 12,
    )
    const cfData = calc_cf(values, loan_sim)
    setSimData(cfData)

    const cf_data = sim_cf({
      inputs: values,
      loan_sim,
      years: YEARS,
    })

    setCashFlowData(cf_data)
    // TODO: remove
    setLoanSimData(loan_sim)

    const total_invested = cfData.total_invested
    const yMax = total_invested
    const yMin = total_invested * (1 - 10 * TOTAL_INVESTMENT_DELTA)

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
        const total = total_invested * (1 - j * TOTAL_INVESTMENT_DELTA)
        const cash = (total * i) / 10
        const principal = total - cash

        const loan_sim = loan_lib.sim_fixed_rate_loan(
          principal,
          values.interest_rate / (100 * 12),
          values.years * 12,
        )

        const cfData = calc_cf(
          {
            ...values,
            cash,
            principal,
          },
          loan_sim,
        )

        const roi = (cfData.atcf / values.property_price) * 100
        const ccr = cfData.ccr * 100

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
    setLoanSimData(null)
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
  // TODO: sticky to bottom, form buttons?
  // TODO: simple and advance forms
  // TODO: line graphs (WIP) - cummulative cf
  return (
    <div ref={ref} className="flex flex-row">
      <div className="min-w-[260px] h-screen overflow-y-auto px-6 py-6">
        <Form onSubmit={onSubmit} onReset={onReset} />
      </div>

      <div className="flex flex-row overflow-x-auto">
        {loanSimData != null ? (
          <LineGraph
            xMin={0}
            xMax={YEARS}
            yMin={0}
            yMax={300}
            data={[
              xy(cashFlowData.map((d) => d.gpi)),
              xy(loanSimData.principals),
              xy(loanSimData.interests),
              xy(loanSimData.debt_repayments),
            ]}
            colors={["green", "blue", "orange", "red"]}
          />
        ) : null}

        {sim != null ? (
          <div className="px-6 py-6 min-w-[300px]">
            <div className="text-xl font-semibold mb-2">収支試算</div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>総投資額</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.total_invested)} 円
                  </td>
                </tr>
                <tr>
                  <td>表面利回り</td>
                  <td style={{ textAlign: "right" }}>
                    {Percent(sim.gross_yield)} %
                  </td>
                </tr>
                <tr>
                  <td>返済総額</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.total_debt_payment)} 円
                  </td>
                </tr>
                <tr>
                  <td>収入 (月)</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.noi / 12)} 円</td>
                </tr>
                <tr>
                  <td>返済額 (月)</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.ads / 12)} 円</td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>返済比率</td>
                  <td style={{ textAlign: "right" }}>
                    {Percent(sim.egi > 0 ? sim.ads / sim.egi : 1)} %
                  </td>
                </tr>
                <tr>
                  <td>GPI</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.gpi)} 円</td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>EGI</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.egi)} 円</td>
                </tr>
                <tr>
                  <td>固定資産税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.property_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>固定資産税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.property_tax_building)} 円
                  </td>
                </tr>
                <tr>
                  <td>都市計画税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.city_planning_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>都市計画税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.city_planning_tax_building)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>OPEX</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.opex)} 円</td>
                </tr>
                <tr>
                  <td>NOI</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.noi)} 円</td>
                </tr>
                <tr>
                  <td>ADS</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.ads)} 円</td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>BTCF</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.btcf)} 円</td>
                </tr>
                <tr>
                  <td>減価償却 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.building_depreciation)} 円
                  </td>
                </tr>
                <tr>
                  <td>減価償却年数 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {sim.building_depreciation_period} 年
                  </td>
                </tr>
                <tr>
                  <td>元金返済</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.principal)} 円
                  </td>
                </tr>
                <tr>
                  <td>申告所得</td>
                  <td style={{ textAlign: "right" }}>
                    {Yen(sim.taxable_income)} 円
                  </td>
                </tr>
                <tr>
                  <td>税金</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.tax)} 円</td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>ATCF</td>
                  <td style={{ textAlign: "right" }}>{Yen(sim.atcf)} 円</td>
                </tr>
                <tr>
                  <td>K</td>
                  <td style={{ textAlign: "right" }}>{Percent(sim.k)} %</td>
                </tr>
                <tr>
                  <td>FCR</td>
                  <td style={{ textAlign: "right" }}>{Percent(sim.fcr)} %</td>
                </tr>
                <tr>
                  <td>CCR</td>
                  <td style={{ textAlign: "right" }}>{Percent(sim.ccr)} %</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {heat != null ? (
          <div className="mt-8 flex flex-col items-center mx-auto">
            <Select
              value={zType}
              onChange={onChangeDataType}
              options={[
                { value: "roi", text: "ATCF 利回り" },
                { value: "ccr", text: "CCR" },
              ]}
            />
            <GradientBar
              width={canvasSize}
              height={60}
              zMin={heat[zType].zMin}
              zMax={heat[zType].zMax}
              render={(z) => `${z.toFixed(2)} %`}
            />
            <Range
              label={zType == "roi" ? "ATCF 利回り" : "CCR"}
              min={0}
              max={zType == "roi" ? MAX_ROI : MAX_CCR}
              value={minZ[zType]}
              onChange={onChangeMinZ}
            />
            <HeatMap
              width={canvasSize}
              height={canvasSize}
              xs={XS}
              ys={heat.ys}
              zs={heat[zType].zs}
              xMin={X_MIN}
              xMax={X_MAX}
              yMin={heat.yMin}
              yMax={heat.yMax}
              zMin={heat[zType].zMin}
              zMax={heat[zType].zMax}
              renderX={renderX}
              renderY={renderY}
              renderZ={renderZ}
            />
            <div className="text-sm">X = 自己資金比率 Y = 総投資額</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
