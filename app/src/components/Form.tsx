import React, { useState } from "react"
import { Inputs, Errors, calcPrincipal, validate } from "../lib/form"
import Input from "./Input"

const INPUTS: Inputs<string> = {
  property_price: "2000",
  gpi: "200",
  delta_gpi: "0",
  vacancy_rate: "15",
  opex_rate: "20",
  cash: "0",
  purchase_cost: "0",
  principal: "2000",
  years: "10",
  interest_rate: "2",
}

interface Props {
  onSubmit: (values: Inputs<number>) => void
  onReset: () => void
}

const Form: React.FC<Props> = ({ onSubmit, onReset }) => {
  const [inputs, setInputs] = useState<Inputs<string>>(INPUTS)
  const [errors, setErrors] = useState<Errors>({})

  function onChange(name: string, value: string) {
    setInputs((inputs) => {
      const newInputs = {
        ...inputs,
        [name]: value,
      }

      const principal = calcPrincipal(newInputs)

      return {
        ...newInputs,
        principal: principal != null ? principal.toString() : "",
      }
    })
  }

  function _onSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>,
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
        label="満室年収"
        unit="万円"
        name="gpi"
        value={inputs.gpi}
        onChange={onChange}
        error={errors?.gpi}
      />
      <Input
        label="家賃変動率"
        unit="%"
        name="delta_gpi"
        value={inputs.delta_gpi}
        onChange={onChange}
        error={errors?.delta_gpi}
      />
      <Input
        label="空室率"
        unit="%"
        name="vacancy_rate"
        value={inputs.vacancy_rate}
        onChange={onChange}
        error={errors?.vacancy_rate}
      />
      <Input
        label="諸経費率"
        unit="%"
        name="opex_rate"
        value={inputs.opex_rate}
        onChange={onChange}
        error={errors?.opex_rate}
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
        label="購入時諸費用"
        unit="万円"
        name="purchase_cost"
        value={inputs.purchase_cost}
        onChange={onChange}
        error={errors?.purchase_cost}
      />
      <Input
        label="借入金額"
        unit="万円"
        name="principal"
        value={inputs.principal}
        error=""
        disabled={true}
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
        step={0.01}
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
