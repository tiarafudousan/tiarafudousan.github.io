import React, { useState } from "react"
import "./App.css"
import { Inputs, Errors, validate, INPUTS } from "./lib/form"
import { simulate } from "./lib/sim"
import Input from "./components/Input"
import { lerp } from "./components/graphs/lib"
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
  const [inputs, setInputs] = useState<Inputs<string>>(INPUTS)
  const [errors, setErrors] = useState<Errors>({})
  const [data, setHeatMapData] = useState<HeatMapData | null>(null)

  function onChange(name: string, value: string) {
    setInputs((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  function onSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    setErrors({})

    const [errors, values] = validate(inputs)

    if (errors) {
      setErrors(errors)
      return
    }

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

    return
  }

  function onClickReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setInputs(INPUTS)
    setErrors({})
    setHeatMapData(null)
  }

  return (
    <div className="flex flex-col items-center py-10 mx-auto max-w-[800px]">
      <form onSubmit={onSubmit}>
        <h1 className="text-xl font-bold">物件情報</h1>
        <Input
          label="物件価格"
          unit="万円"
          name="property_price"
          value={inputs.property_price}
          onChange={onChange}
          error={errors?.property_price}
        />
        <Input
          label="満室時想定年収"
          unit="万円"
          name="yearly_income"
          value={inputs.yearly_income}
          onChange={onChange}
          error={errors?.property_price}
        />
        <Input
          label="想定空室率"
          unit="%"
          name="vacancy_rate"
          value={inputs.vacancy_rate}
          onChange={onChange}
          error={errors?.vacancy_rate}
        />
        <Input
          label="諸経費率"
          unit="%"
          name="running_cost_rate"
          value={inputs.running_cost_rate}
          onChange={onChange}
          error={errors?.running_cost_rate}
        />

        <h1 className="text-xl font-bold">資金計画</h1>
        <Input
          label="自己資金"
          unit="万円"
          name="cash"
          value={inputs.cash}
          onChange={onChange}
          error={errors?.cash}
        />
        <Input
          label="借入金額"
          unit="万円"
          name="loan"
          value={inputs.loan}
          onChange={onChange}
          error={errors?.loan}
        />
        <Input
          label="借入期間"
          unit="年"
          name="years"
          value={inputs.years}
          onChange={onChange}
          error={errors?.years}
        />
        <Input
          label="借入金利"
          unit="%"
          name="interest_rate"
          value={inputs.interest_rate}
          onChange={onChange}
          error={errors?.interest_rate}
        />

        <div className="flex flex-row justify-center space-x-2 mt-4">
          <button
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={(e) => onSubmit}
          >
            計算
          </button>
          <button
            className="px-5 py-2 rounded-lg text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClickReset}
          >
            リセット
          </button>
        </div>
      </form>

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
