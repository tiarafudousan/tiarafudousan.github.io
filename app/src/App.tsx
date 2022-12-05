import React, { useState } from "react"
import "./App.css"
import Input from "./components/Input"

const INITIAL_STATE = {
  propertyPrice: "",
  yearlyIncome: "",
  vacancyRate: "",
  runningCostRate: "",
  cash: "",
  loan: "",
  n: "",
  interestRate: "",
}

function App() {
  const [inputs, setInputs] = useState(INITIAL_STATE)

  function onChange(name: string, value: string) {
    setInputs((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  return (
    <div className="my-5 mx-5 max-w-[300px] bg-red-100">
      <h1 className="text-xl font-bold">物件情報</h1>
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
        <button className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-green-300">
          計算
        </button>
        <button className="px-5 py-2 rounded-lg text-gray-900 bg-white hover:bg-gray-100 border border-gray-300 transition ease-in-out duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300">
          リセット
        </button>
      </div>
    </div>
  )
}

export default App
