import React, { useState } from "react"
import "./App.css"
import { Inputs, Errors } from "./types"
import Input from "./components/Input"

const INITIAL_STATE: Inputs<string> = {
  property_price: "",
  yearly_income: "",
  vacancy_rate: "",
  running_cost_rate: "",
  cash: "",
  loan: "",
  years: "",
  interest_rate: "",
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

function App() {
  const [inputs, setInputs] = useState<Inputs<string>>(INITIAL_STATE)
  const [errors, setErrors] = useState<Errors>({})

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
    } else {
    }

    // TODO: calculate
  }

  function onClickReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setInputs(INITIAL_STATE)
    setErrors({})
  }

  return (
    <div className="my-5 mx-5 max-w-[300px] bg-gray-200">
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
