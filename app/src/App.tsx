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
import PriceEstimator from "./components/PriceEstimator"
import CashFlowTable from "./components/CashFlowTable"
import InitialCostTable from "./components/InitialCostTable"
import LineGraph from "./components/graphs/LineGraph"
import BarGraph from "./components/graphs/BarGraph"
import { xy } from "./components/graphs/Graph/utils"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"
import Range from "./components/Range"
import Select from "./components/Select"

const YEARS = 30

// Heat map
function render_x(x: number): string {
  return `${x} %`
}

function render_y(y: number): string {
  return `${Math.floor(y)} 万`
}

function render_z(z: number): string {
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
const CF_COLORS = [
  "rgba(107, 142, 35, 1)",
  "rgba(154, 205, 50, 1)",
  "rgba(128, 0, 128, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 215, 0, 1)",
  "rgba(255, 165, 0, 1)",
  "rgba(255, 99, 71, 1)",
]
const CF_AMBIENT_COLORS = [
  "rgba(107, 142, 35, 0.2)",
  "rgba(154, 205, 50, 0.2)",
  "rgba(128, 0, 128, 0.2)",
  "rgba(0, 128, 128, 0.2)",
  "rgba(255, 215, 0, 0.2)",
  "rgba(255, 165, 0, 0.2)",
  "rgba(255, 99, 71, 0.2)",
]
const RATE_COLORS = [
  "rgba(128, 0, 128, 1)",
  "rgba(154, 205, 50, 1)",
  "rgba(255, 165, 0, 1)",
  "rgba(0, 128, 128, 1)",
  "rgba(255, 99, 71, 1)",
  "rgba(255, 215, 0, 1)",
  "rgba(255, 165, 0, 1)",
  "rgba(255, 99, 71, 1)",
]
const RATE_AMBIENT_COLORS = [
  "rgba(128, 0, 128, 0.2)",
  "rgba(154, 205, 50, 0.2)",
  "rgba(255, 165, 0, 0.2)",
  "rgba(0, 128, 128, 0.2)",
  "rgba(255, 99, 71, 0.2)",
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
  const [canvas_size, set_canvas_size] = useState(0)

  const [z_type, set_data_type] = useState<ZType>("roi")
  const [min_z, set_min_z] = useState(DEFAULT_Z)
  const [heat_map, set_heat_map_data] = useState<HeatMapData | null>(null)
  const [loan_sim_data, set_loan_sim_data] = useState<FixedRateLoan | null>(
    null,
  )
  const [cf_data, set_cf_data] = useState<CashFlowData[]>([])
  const [initial_cost_data, set_initial_cost_data] =
    useState<InitialCost | null>(null)

  useEffect(() => {
    if (ref.current) {
      // @ts-ignore
      const w = ref.current.offsetWidth
      set_canvas_size(bound(w, MIN_GRAPH_WIDTH, MAX_GRAPH_WIDTH))
    }
  }, [])

  function on_submit(values: Inputs<number>) {
    const is_small_scale_residential_land = true

    const initial_cost = calc_initial_cost(values)
    const loan_sim = loan_lib.sim_fixed_rate_loan(
      values.principal,
      values.interest_rate / (100 * 12),
      values.years * 12,
    )
    const cf_data = sim_cf({
      inputs: values,
      initial_cost,
      loan_sim,
      years: YEARS,
      is_small_scale_residential_land,
    })

    set_initial_cost_data(initial_cost)
    set_cf_data(cf_data)
    set_loan_sim_data(loan_sim)

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

        // TODO: simulate exclude initial cost?
        // TODO: fix ccr for heat map
        const cf_data = calc_cf({
          inputs: {
            ...values,
            principal,
          },
          initial_cost,
          loan_sim,
          delta_year: 0,
          is_small_scale_residential_land,
          exclude_initial_opex: true,
        })

        const roi = (cf_data.btcf / values.property_price) * 100
        const ccr = cf_data.ccr * 100

        zMax.roi = Math.max(zMax.roi, roi)
        zMax.ccr = Math.max(zMax.ccr, ccr)
        zMin.roi = Math.min(zMin.roi, roi)
        zMax.ccr = Math.max(zMax.ccr, ccr)

        zs.roi[i].push(roi)
        zs.ccr[i].push(ccr)
      }
    }

    zMax.roi = min_z.roi
    zMax.ccr = min_z.ccr

    set_heat_map_data((state) => ({
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

  function on_reset() {
    set_heat_map_data(null)
    set_loan_sim_data(null)
    set_min_z(DEFAULT_Z)
  }

  function on_change_min_z(value: number) {
    set_min_z((state) => ({
      ...state,
      [z_type]: value,
    }))

    set_heat_map_data((state) => {
      if (state) {
        return {
          ...state,
          [z_type]: {
            ...state[z_type],
            zMax: value,
          },
        }
      }
      return null
    })
  }

  function on_change_data_type(value: string) {
    set_data_type(value as ZType)
  }

  // TODO: mobile
  // TODO: sticky to bottom, form buttons?
  // TODO: simple and advance forms
  // TODO: fix graph - line rendered below y = 0
  // TODO: where to place PriceEstimator

  return (
    <div ref={ref} className="flex flex-row">
      <div className="min-w-[280px] h-screen overflow-y-auto px-6 py-6">
        <Form onSubmit={on_submit} onReset={on_reset} />
        <PriceEstimator />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row overflow-x-auto py-6">
          {loan_sim_data != null ? (
            <div className="flex flex-col px-4">
              <LineGraph
                width={1000}
                height={200}
                xMin={0}
                xMax={YEARS - 1}
                yMin={Math.min(0, ...cf_data.map((d) => d.atcf))}
                yMax={cf_data[0].gpi}
                data={[
                  xy(cf_data.map((d) => d.gpi)),
                  xy(cf_data.map((d) => d.noi)),
                  xy(cf_data.map((d) => d.btcf)),
                  xy(cf_data.map((d) => d.atcf)),
                  xy(loan_sim_data.principals),
                  xy(loan_sim_data.interests),
                  xy(loan_sim_data.debt_repayments),
                ]}
                colors={CF_COLORS}
                ambientColors={CF_AMBIENT_COLORS}
                labels={[
                  "GPI",
                  "NOI",
                  "BTCF",
                  "ATCF",
                  "元金返済",
                  "金利",
                  "返済額",
                ]}
                renderYHover={(y) => Math.floor(y)}
              />
              <BarGraph
                xMin={0}
                xMax={YEARS - 1}
                yMin={Math.min(...fold(cf_data.map((d) => d.btcf)))}
                yMax={
                  Math.max(Math.max(...fold(cf_data.map((d) => d.btcf))), 0) *
                  1.1
                }
                data={[xy(fold(cf_data.map((d) => d.btcf)))]}
              />
              <LineGraph
                width={1000}
                height={160}
                xMin={0}
                xMax={YEARS - 1}
                yMin={-1}
                yMax={2}
                data={[
                  xy(cf_data.map((d) => d.k)),
                  xy(cf_data.map((d) => d.fcr)),
                  xy(cf_data.map((d) => d.ccr)),
                  xy(cf_data.map((d) => d.ber)),
                  xy(cf_data.map((d) => d.dcr)),
                ]}
                colors={RATE_COLORS}
                ambientColors={RATE_AMBIENT_COLORS}
                labels={["K", "FCR", "CCR", "BER", "DCR"]}
                renderYHover={(y) => y.toFixed(2)}
              />
              <div className="overflow-x-auto w-[1800px]">
                <CashFlowTable data={cf_data} />
              </div>
            </div>
          ) : null}

          {heat_map != null ? (
            <div className="mt-8 flex flex-col items-center mx-auto">
              <Select
                value={z_type}
                onChange={on_change_data_type}
                options={[
                  { value: "roi", text: "BTCF 利回り" },
                  { value: "ccr", text: "CCR" },
                ]}
              />
              <GradientBar
                width={canvas_size}
                height={60}
                zMin={heat_map[z_type].zMin}
                zMax={heat_map[z_type].zMax}
                render={(z) => `${z.toFixed(2)} %`}
              />
              <Range
                label={z_type == "roi" ? "BTCF 利回り" : "CCR"}
                min={0}
                max={z_type == "roi" ? MAX_ROI : MAX_CCR}
                value={min_z[z_type]}
                onChange={on_change_min_z}
              />
              <HeatMap
                width={canvas_size}
                height={canvas_size}
                xs={XS}
                ys={heat_map.ys}
                zs={heat_map[z_type].zs}
                xMin={X_MIN}
                xMax={X_MAX}
                yMin={heat_map.yMin}
                yMax={heat_map.yMax}
                zMin={heat_map[z_type].zMin}
                zMax={heat_map[z_type].zMax}
                renderX={render_x}
                renderY={render_y}
                renderZ={render_z}
              />
              <div className="text-sm">X = 自己資金比率 Y = 総事業費</div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col w-[360px]">
          {initial_cost_data != null ? (
            <div className="px-4 min-w-[360px]">
              <InitialCostTable data={initial_cost_data} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
