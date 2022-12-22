import React, { useState } from "react"
import { Inputs, Errors, validate } from "../lib/form"
import Input from "./Input"

const INPUTS: Inputs<string> = {
  property_price: "",
  yearly_income: "",
  vacancy_rate: "15",
  running_cost_rate: "20",
  cash: "0",
  loan: "",
  years: "10",
  interest_rate: "3",
}

interface Props {
  onSubmit: (values: Inputs<number>) => void
  onReset: () => void
}

const Form: React.FC<Props> = ({ onSubmit, onReset }) => {
  const [inputs, setInputs] = useState<Inputs<string>>(INPUTS)
  const [errors, setErrors] = useState<Errors>({})

  function onChange(name: string, value: string) {
    setInputs((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  function _onSubmit(
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

    onSubmit(values)
  }

  function _onReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    setInputs(INPUTS)
    setErrors({})
    onReset()
  }
  return (
    <form onSubmit={_onSubmit}>
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
          onClick={_onReset}
        >
          リセット
        </button>
      </div>
    </form>
  )
}

export default Form
