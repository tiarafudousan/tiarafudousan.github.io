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
import CashFlowTable from "./components/CashFlowTable"
import InitialCostTable from "./components/InitialCostTable"
import CashFlowTree from "./components/CashFlowTree"
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
  return `${Math.floor(y)} 万`
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
    const is_small_scale_residential_land = true

    const initial_cost = calc_initial_cost(values)

    const loan_sim = loan_lib.sim_fixed_rate_loan(
      values.principal,
      values.interest_rate / (100 * 12),
      values.years * 12,
    )
    const cf_data = sim_cf({
      inputs: values,
      initial_cost: initial_cost.total,
      loan_sim,
      years: YEARS,
      is_small_scale_residential_land,
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

        // TODO: simulate include initial cost?
        const cfData = calc_cf({
          inputs: {
            ...values,
            principal,
          },
          // TODO: initial cost > 0?
          initial_cost: 0,
          loan_sim,
          delta_year: 0,
          is_small_scale_residential_land,
        })

        const roi = (cfData.btcf / values.property_price) * 100
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
      <div className="min-w-[280px] h-screen overflow-y-auto px-6 py-6">
        <Form onSubmit={onSubmit} onReset={onReset} />
      </div>

      <div className="flex flex-row overflow-x-auto py-6">
        <div className="flex flex-col">
          {initialCostData != null ? (
            <div className="px-4 min-w-[360px]">
              <InitialCostTable data={initialCostData} />
            </div>
          ) : null}

          {cashFlowData.length > 0 ? (
            <div className="py-4 px-4 min-w-[300px]">
              <CashFlowTree data={cashFlowData[0]} />
            </div>
          ) : null}
        </div>

        {loanSimData != null ? (
          <div className="flex flex-col px-4">
            <LineGraph
              xMin={0}
              xMax={YEARS - 1}
              yMin={Math.min(0, ...cashFlowData.map((d) => d.atcf))}
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
            <div className="overflow-x-auto w-[800px]">
              <CashFlowTable data={cashFlowData} />
            </div>
          </div>
        ) : null}

        {heat != null ? (
          <div className="mt-8 flex flex-col items-center mx-auto">
            <Select
              value={zType}
              onChange={onChangeDataType}
              options={[
                { value: "roi", text: "BTCF 利回り" },
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
              label={zType == "roi" ? "BTCF 利回り" : "CCR"}
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
