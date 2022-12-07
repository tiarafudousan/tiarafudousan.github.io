import React, { useState } from "react"
import "./App.css"
import Input from "./components/Input"

interface Inputs<a> {
  propertyPrice: a
  yearlyIncome: a
  vacancyRate: a
  runningCostRate: a
  cash: a
  loan: a
  n: a
  interestRate: a
}

interface Errors {
  propertyPrice?: string
  yearlyIncome?: string
  vacancyRate?: string
  runningCostRate?: string
  cash?: string
  loan?: string
  n?: string
  interestRate?: string
}

const INITIAL_STATE: Inputs<string> = {
  propertyPrice: "",
  yearlyIncome: "",
  vacancyRate: "",
  runningCostRate: "",
  cash: "",
  loan: "",
  n: "",
  interestRate: "",
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
    propertyPrice: 0,
    yearlyIncome: 0,
    vacancyRate: 0,
    runningCostRate: 0,
    cash: 0,
    loan: 0,
    n: 0,
    interestRate: 0,
  }
  const errors: Errors = {}

  {
    const [error, value] = validateNum(inputs.propertyPrice)
    if (error) {
      errors.propertyPrice = error
    } else {
      values.propertyPrice = value
    }
  }
  {
    const [error, value] = validateNum(inputs.yearlyIncome)
    if (error) {
      errors.yearlyIncome = error
    } else {
      values.yearlyIncome = value
    }
  }
  {
    const [error, value] = validateNum(inputs.vacancyRate, false, 0, 100)
    if (error) {
      errors.vacancyRate = error
    } else {
      values.vacancyRate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.runningCostRate, false, 0, 100)
    if (error) {
      errors.runningCostRate = error
    } else {
      values.runningCostRate = value
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
    const [error, value] = validateNum(inputs.n)
    if (error) {
      errors.n = error
    } else {
      values.n = value
    }
  }
  {
    const [error, value] = validateNum(inputs.interestRate, false, 0)
    if (error) {
      errors.interestRate = error
    } else {
      values.interestRate = value
    }
  }

  return [Object.keys(errors).length > 0 ? errors : null, values]
}

function App() {
  const [inputs, setInputs] = useState<Inputs<string>>(INITIAL_STATE)

  function onChange(name: string, value: string) {
    setInputs((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  function onClickReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setInputs(INITIAL_STATE)
  }

  function onSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    const [errors, values] = validate(inputs)

    // TODO: calculate
  }

  return (
    <div className="my-5 mx-5 max-w-[300px] bg-gray-200">
      <h1 className="text-xl font-bold">物件情報</h1>
      <form onSubmit={onSubmit}>
        <Input
          label="物件価格"
          unit="万円"
          name="propertyPrice"
          value={inputs.propertyPrice}
          onChange={onChange}
        />
        <Input
          label="満室時想定年収"
          unit="万円"
          name="yearlyIncome"
          value={inputs.yearlyIncome}
          onChange={onChange}
        />
        <Input
          label="想定空室率"
          unit="%"
          name="vacancyRate"
          value={inputs.vacancyRate}
          onChange={onChange}
        />
        <Input
          label="諸経費率"
          unit="%"
          name="runningCostRate"
          value={inputs.runningCostRate}
          onChange={onChange}
        />

        <h1 className="text-xl font-bold">資金計画</h1>
        <Input
          label="自己資金"
          unit="万円"
          name="cash"
          value={inputs.cash}
          onChange={onChange}
        />
        <Input
          label="借入金額"
          unit="万円"
          name="loan"
          value={inputs.loan}
          onChange={onChange}
        />
        <Input
          label="借入期間"
          unit="年"
          name="n"
          value={inputs.n}
          onChange={onChange}
        />
        <Input
          label="借入金利"
          unit="%"
          name="interestRate"
          value={inputs.interestRate}
          onChange={onChange}
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
