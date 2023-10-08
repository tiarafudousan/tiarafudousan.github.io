import React, { useState, useRef, useEffect } from "react"
import "./App.css"
import styles from "./App.module.css"
import { Inputs } from "./lib/form"
import { fold } from "./lib/utils"
import {
  calc_cf,
  sim_cf,
  CashFlowData,
  calc_initial_cost,
  InitialCost,
} from "./lib/cf"
import * as loan_lib from "./lib/loan"
import { FixedRateLoan } from "./lib/loan"
import { lerp, bound } from "./components/graphs/lib"
import Form from "./components/Form"
import Table from "./components/Table"
import LineGraph from "./components/graphs/LineGraph"
import BarGraph from "./components/graphs/BarGraph"
import { xy } from "./components/graphs/Graph/utils"
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
const COLORS = [
  "rgba(107, 142, 35, 1)",
  "rgba(154, 205, 50, 1)",
  "rgba(128, 0, 128, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 215, 0, 1)",
  "rgba(255, 165, 0, 1)",
  "rgba(255, 99, 71, 1)",
]
const AMBIENT_COLORS = [
  "rgba(107, 142, 35, 0.2)",
  "rgba(154, 205, 50, 0.2)",
  "rgba(128, 0, 128, 0.2)",
  "rgba(0, 128, 128, 0.2)",
  "rgba(255, 215, 0, 0.2)",
  "rgba(255, 165, 0, 0.2)",
  "rgba(255, 99, 71, 0.2)",
]

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

function yen(value: number): string {
  return Math.round(value * 10000).toLocaleString()
}

function percent(value: number): string {
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
  const [heat, setHeatMapData] = useState<HeatMapData | null>(null)
  const [loanSimData, setLoanSimData] = useState<FixedRateLoan | null>(null)
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [initialCostData, setInitialCostData] = useState<InitialCost | null>(
    null,
  )

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      const w = ref.current.offsetWidth
      setCanvasSize(bound(w, MIN_GRAPH_WIDTH, MAX_GRAPH_WIDTH))
    }
  }, [])

  function onSubmit(values: Inputs<number>) {
    const initial_cost = calc_initial_cost(values)

    const loan_sim = loan_lib.sim_fixed_rate_loan(
      values.principal,
      values.interest_rate / (100 * 12),
      values.years * 12,
    )
    const cf_data = sim_cf({
      inputs: values,
      loan_sim,
      years: YEARS,
    })

    setInitialCostData(initial_cost)
    setCashFlowData(cf_data)
    setLoanSimData(loan_sim)

    const total_invested = cf_data[0].total_invested
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

        const cfData = calc_cf({
          inputs: {
            ...values,
            cash,
            principal,
          },
          loan_sim,
          delta_year: 0,
        })

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

  // TODO: fix graph - line rendered below y = 0

  return (
    <div ref={ref} className="flex flex-row">
      <div className="min-w-[260px] h-screen overflow-y-auto px-6 py-6">
        <Form onSubmit={onSubmit} onReset={onReset} />
      </div>

      <div className="flex flex-row overflow-x-auto">
        {loanSimData != null ? (
          <div className="flex flex-col">
            <LineGraph
              xMin={0}
              xMax={YEARS - 1}
              yMin={Math.min(...cashFlowData.map((d) => d.atcf))}
              yMax={cashFlowData[0].gpi}
              data={[
                xy(cashFlowData.map((d) => d.gpi)),
                xy(cashFlowData.map((d) => d.noi)),
                xy(cashFlowData.map((d) => d.btcf)),
                xy(cashFlowData.map((d) => d.atcf)),
                xy(loanSimData.principals),
                xy(loanSimData.interests),
                xy(loanSimData.debt_repayments),
              ]}
              colors={COLORS}
              ambientColors={AMBIENT_COLORS}
              labels={[
                "GPI",
                "NOI",
                "BTCF",
                "ATCF",
                "元金返済",
                "金利",
                "返済額",
              ]}
            />
            <BarGraph
              xMin={0}
              xMax={YEARS - 1}
              yMin={Math.min(...fold(cashFlowData.map((d) => d.atcf)))}
              yMax={
                Math.max(
                  Math.max(...fold(cashFlowData.map((d) => d.atcf))),
                  0,
                ) * 1.1
              }
              data={[xy(fold(cashFlowData.map((d) => d.atcf)))]}
            />
            <Table data={cashFlowData} />
          </div>
        ) : null}

        {initialCostData != null ? (
          <div className="px-6 py-6 min-w-[380px]">
            <div className="text-xl font-semibold mb-2">購入費</div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>印紙代 売買契約</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.stamp_tax_real_estate)} 円
                  </td>
                </tr>
                <tr>
                  <td>印紙代 金消契約</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.stamp_tax_bank)} 円
                  </td>
                </tr>
                <tr>
                  <td>抵当権設定費</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.mortgage_registration_tax)} 円
                  </td>
                </tr>
                <tr>
                  <td>所有権移転登録免許税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.registration_license_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>所有権移転登録免許税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.registration_license_tax_building)} 円
                  </td>
                </tr>
                <tr>
                  <td>司法書士費</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.judicial_scrivener_fee)} 円
                  </td>
                </tr>
                <tr>
                  <td>仲介手数料</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.brokerage_fee)} 円
                  </td>
                </tr>
                <tr>
                  <td>不動産取得税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.real_estate_acquisition_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>不動産取得税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.real_estate_acquisition_tax_building)}{" "}
                    円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>諸経費</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.purchase_misc_fee)} 円
                  </td>
                </tr>
                <tr>
                  <td>合計</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(initialCostData.total)} 円
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}

        {cashFlowData.length > 0 ? (
          <div className="px-6 py-6 min-w-[300px]">
            <div className="text-xl font-semibold mb-2">収支試算</div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>総投資額</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].total_invested)} 円
                  </td>
                </tr>
                <tr>
                  <td>表面利回り</td>
                  <td style={{ textAlign: "right" }}>
                    {percent(cashFlowData[0].gross_yield)} %
                  </td>
                </tr>
                <tr>
                  <td>返済総額</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].total_debt_payment)} 円
                  </td>
                </tr>
                <tr>
                  <td>収入 (月)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].noi / 12)} 円
                  </td>
                </tr>
                <tr>
                  <td>返済額 (月)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].ads / 12)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>返済比率</td>
                  <td style={{ textAlign: "right" }}>
                    {percent(
                      cashFlowData[0].egi > 0
                        ? cashFlowData[0].ads / cashFlowData[0].egi
                        : 1,
                    )}{" "}
                    %
                  </td>
                </tr>
                <tr>
                  <td>GPI</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].gpi)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>EGI</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].egi)} 円
                  </td>
                </tr>
                <tr>
                  <td>固定資産税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].property_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>固定資産税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].property_tax_building)} 円
                  </td>
                </tr>
                <tr>
                  <td>都市計画税 (土地)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].city_planning_tax_land)} 円
                  </td>
                </tr>
                <tr>
                  <td>都市計画税 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].city_planning_tax_building)} 円
                  </td>
                </tr>
                <tr>
                  <td>管理費</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].maintanence_fee)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>OPEX</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].opex)} 円
                  </td>
                </tr>
                <tr>
                  <td>NOI</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].noi)} 円
                  </td>
                </tr>
                <tr>
                  <td>ADS</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].ads)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>BTCF</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].btcf)} 円
                  </td>
                </tr>
                <tr>
                  <td>減価償却 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].building_depreciation)} 円
                  </td>
                </tr>
                <tr>
                  <td>減価償却年数 (建物)</td>
                  <td style={{ textAlign: "right" }}>
                    {cashFlowData[0].building_depreciation_period} 年
                  </td>
                </tr>
                <tr>
                  <td>元金返済</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].principal)} 円
                  </td>
                </tr>
                <tr>
                  <td>申告所得</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].taxable_income)} 円
                  </td>
                </tr>
                <tr>
                  <td>税金</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].tax)} 円
                  </td>
                </tr>
                <tr className="border-b-2 border-gray-200">
                  <td>ATCF</td>
                  <td style={{ textAlign: "right" }}>
                    {yen(cashFlowData[0].atcf)} 円
                  </td>
                </tr>
                <tr>
                  <td>K</td>
                  <td style={{ textAlign: "right" }}>
                    {percent(cashFlowData[0].k)} %
                  </td>
                </tr>
                <tr>
                  <td>FCR</td>
                  <td style={{ textAlign: "right" }}>
                    {percent(cashFlowData[0].fcr)} %
                  </td>
                </tr>
                <tr>
                  <td>CCR</td>
                  <td style={{ textAlign: "right" }}>
                    {percent(cashFlowData[0].ccr)} %
                  </td>
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
