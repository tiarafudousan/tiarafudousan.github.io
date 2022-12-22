import React, { useState } from "react"
import "./App.css"
import { Inputs, Errors } from "./types"
import Input from "./components/Input"
import { lerp } from "./components/graphs/lib"
import HeatMap from "./components/graphs/HeatMap"
import GradientBar from "./components/graphs/GradientBar"
import { simulate } from "./lib"

const PRICE_DELTA = 0.05
const MIN_YIELD = 2
const MIN_CCR = 20

const INITIAL_STATE: Inputs<string> = {
  property_price: "",
  yearly_income: "",
  vacancy_rate: "15",
  running_cost_rate: "20",
  cash: "",
  loan: "",
  years: "10",
  interest_rate: "3",
}

function validateNum(
  input: string,
  int: boolean = true,
  min = 0,
  max = Infinity
): [error: string | null, value: number] {
  let error = null
  const value = int ? parseInt(input) : parseFloat(input)

  if (isNaN(value)) {
    error = "数字を入力してください"
  } else if (value < min) {
    error = `${min}より大きい数字を入力してください`
  } else if (value > max) {
    error = `${max}より小さい数字を入力してください`
  }

  return [error, value]
}

function validate(
  inputs: Inputs<string>
): [errors: Errors | null, values: Inputs<number>] {
  const values: Inputs<number> = {
    property_price: 0,
    yearly_income: 0,
    vacancy_rate: 0,
    running_cost_rate: 0,
    cash: 0,
    loan: 0,
    years: 0,
    interest_rate: 0,
  }
  const errors: Errors = {}

  {
    const [error, value] = validateNum(inputs.property_price)
    if (error) {
      errors.property_price = error
    } else {
      values.property_price = value
    }
  }
  {
    const [error, value] = validateNum(inputs.yearly_income)
    if (error) {
      errors.yearly_income = error
    } else {
      values.yearly_income = value
    }
  }
  {
    const [error, value] = validateNum(inputs.vacancy_rate, false, 0, 100)
    if (error) {
      errors.vacancy_rate = error
    } else {
      values.vacancy_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.running_cost_rate, false, 0, 100)
    if (error) {
      errors.running_cost_rate = error
    } else {
      values.running_cost_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.cash)
    if (error) {
      errors.cash = error
    } else {
      values.cash = value
    }
  }
  {
    const [error, value] = validateNum(inputs.loan)
    if (error) {
      errors.loan = error
    } else {
      values.loan = value
    }
  }
  {
    const [error, value] = validateNum(inputs.years)
    if (error) {
      errors.years = error
    } else {
      values.years = value
    }
  }
  {
    const [error, value] = validateNum(inputs.interest_rate, false, 0)
    if (error) {
      errors.interest_rate = error
    } else {
      values.interest_rate = value
    }
  }

  return [Object.keys(errors).length > 0 ? errors : null, values]
}

// Heat map
function renderX(x: number): string {
  return x.toString()
}

function renderY(y: number): string {
  return y.toString()
}

function renderZ(z: number): string {
  return z.toFixed(2)
}

const X_MIN = 0
const X_MAX = 100
const XS = [
  lerp(X_MIN, X_MAX, 0),
  lerp(X_MIN, X_MAX, 0.1),
  lerp(X_MIN, X_MAX, 0.2),
  lerp(X_MIN, X_MAX, 0.3),
  lerp(X_MIN, X_MAX, 0.4),
  lerp(X_MIN, X_MAX, 0.5),
  lerp(X_MIN, X_MAX, 0.6),
  lerp(X_MIN, X_MAX, 0.7),
  lerp(X_MIN, X_MAX, 0.8),
  lerp(X_MIN, X_MAX, 0.9),
  lerp(X_MIN, X_MAX, 1),
]

const values = {
  property_price: 2500,
  yearly_income: 274,
  vacancy_rate: 7.5,
  running_cost_rate: 20,
  cash: 0,
  loan: 1000,
  years: 10,
  interest_rate: 2,
}

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

zMax = 5
console.log(zs)
console.log(zMin, zMax)

// for (let i = 0; i <= 10; i++) {
//   const row = []
//   for (let j = 0; j <= 10; j++) {
//     row.push(i + 10 * j)
//   }
//   zs.push(row)
// }

// TODO: hover detail
// TODO:L zMax from input
function App() {
  const [inputs, setInputs] = useState<Inputs<string>>(INITIAL_STATE)
  const [errors, setErrors] = useState<Errors>({})
  const [data, setData] = useState<{
    ys: number[]
    zs: number[][]
    yMin: number
    yMax: number
    zMin: number
    zMax: number
  } | null>({
    ys: [
      lerp(1000, 2000, 0),
      lerp(1000, 2000, 0.1),
      lerp(1000, 2000, 0.2),
      lerp(1000, 2000, 0.3),
      lerp(1000, 2000, 0.4),
      lerp(1000, 2000, 0.5),
      lerp(1000, 2000, 0.6),
      lerp(1000, 2000, 0.7),
      lerp(1000, 2000, 0.8),
      lerp(1000, 2000, 0.9),
      lerp(1000, 2000, 1),
    ],
    zs,
    yMax: 2000,
    yMin: 2000 * (1 - 10 * PRICE_DELTA),
    zMin: zMin,
    zMax: zMax,
  })

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

    return

    // console.log(zs)

    // setErrors({})

    // const [errors, values] = validate(inputs)

    // if (errors) {
    //   setErrors(errors)
    // } else {
    // }
  }

  function onClickReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setInputs(INITIAL_STATE)
    setErrors({})
  }

  return (
    <div className="my-5 mx-5 max-w-[300px] bg-gray-200">
      {data != null ? (
        <>
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
        </>
      ) : null}
      <h1 className="text-xl font-bold">物件情報</h1>
      <form onSubmit={onSubmit}>
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
    </div>
  )
}

export default App
