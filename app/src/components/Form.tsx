import React, { useState } from "react"
import { Inputs, Errors, validate } from "../lib/form"
import Select, { BUILDING_OPTIONS } from "./Select"
import Input from "./Input"

// TODO: toggle simple and advance form

const INPUTS: Inputs<string> = {
  property_price: "2000",
  building_price: "500",
  building_type: "WOOD",
  building_age: "30",
  gpi: "220",
  delta_gpi: "1",
  vacancy_rate: "15",
  // purchase fee //
  property_tax_eval_land: "1000",
  property_tax_eval_building: "500",
  judicial_scrivener_fee: "10",
  brokerage_fee_rate: "3",
  purchase_misc_fee: "10",
  // opex //
  property_tax_base_land: "1000",
  property_tax_base_building: "500",
  maintanence_fee_rate: "5",
  restoration_fee: "10",
  ad_fee: "10",
  insurance_fee: "10",
  opex_misc_fee: "10",
  // loan //
  principal: "1800",
  years: "20",
  interest_rate: "2",
  // tax //
  tax_rate: "30",
  large_scale_repairs: [],
}

// TODO: option to include brokerage fee into property price
const Form: React.FC<{
  onSubmit: (values: Inputs<number>) => void
  onReset: () => void
}> = ({ onSubmit, onReset }) => {
  const [inputs, setInputs] = useState<Inputs<string>>(INPUTS)
  const [errors, setErrors] = useState<Errors>({})

  function onChange(name: string, value: string) {
    setInputs((inputs) => ({
      ...inputs,
      [name]: value,
    }))
  }

  function onChangeSelect(value: string) {
    setInputs((inputs) => ({
      ...inputs,
      building_type: value,
    }))
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
      <h1 className="text-xl font-semibold">物件</h1>
      <Input
        label="物件価格"
        unit="万円"
        name="property_price"
        value={inputs.property_price}
        onChange={onChange}
        error={errors?.property_price}
      />
      <Input
        label="建物価格"
        unit="万円"
        name="building_price"
        value={inputs.building_price}
        onChange={onChange}
        error={errors?.building_price}
      />
      <div className="flex flex-col">
        <label>構造</label>
        <div className="flex flex-row items-center">
          <Select
            value={inputs.building_type}
            options={BUILDING_OPTIONS}
            onChange={onChangeSelect}
          />
        </div>
        <div className="text-sm text-red-500 h-[20px]"></div>
      </div>
      <Input
        label="築年数"
        unit="年"
        name="building_age"
        value={inputs.building_age}
        onChange={onChange}
        error={errors?.building_age}
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
        label="家賃下落率"
        unit="%"
        name="delta_gpi"
        step={0.1}
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
      <h1 className="text-xl font-semibold">購入費</h1>
      <Input
        label="固定資産税評価額 (土地)"
        unit="万円"
        name="property_tax_eval_land"
        value={inputs.property_tax_eval_land}
        onChange={onChange}
        error={errors?.property_tax_eval_land}
      />
      <Input
        label="固定資産税評価額 (建物)"
        unit="万円"
        name="property_tax_eval_building"
        value={inputs.property_tax_eval_building}
        onChange={onChange}
        error={errors?.property_tax_eval_building}
      />
      <Input
        label="司法書士費"
        unit="万円"
        name="judicial_scrivener_fee"
        value={inputs.judicial_scrivener_fee}
        onChange={onChange}
        error={errors?.judicial_scrivener_fee}
      />
      <Input
        label="仲介手数料率"
        unit="%"
        name="brokerage_fee_rate"
        value={inputs.brokerage_fee_rate}
        onChange={onChange}
        error={errors?.brokerage_fee_rate}
      />
      <Input
        label="購入時諸費用"
        unit="万円"
        name="purchase_misc_fee"
        value={inputs.purchase_misc_fee}
        onChange={onChange}
        error={errors?.purchase_misc_fee}
      />
      <h1 className="text-xl font-semibold">支出</h1>
      <Input
        label="管理委託料"
        unit="%"
        name="maintanence_fee_rate"
        value={inputs.maintanence_fee_rate}
        onChange={onChange}
        error={errors?.maintanence_fee_rate}
      />
      <Input
        label="修繕費"
        unit="万円"
        name="restoration_fee"
        value={inputs.restoration_fee}
        onChange={onChange}
        error={errors?.restoration_fee}
      />
      <Input
        label="広告費"
        unit="万円"
        name="ad_fee"
        value={inputs.ad_fee}
        onChange={onChange}
        error={errors?.ad_fee}
      />
      <Input
        label="保険料"
        unit="万円"
        name="insurance_fee"
        value={inputs.insurance_fee}
        onChange={onChange}
        error={errors?.insurance_fee}
      />
      <Input
        label="他運用費"
        unit="万円"
        name="opex_misc_fee"
        value={inputs.opex_misc_fee}
        onChange={onChange}
        error={errors?.opex_misc_fee}
      />
      <Input
        label="固定資産税課税標準額 (土地)"
        unit="万円"
        name="property_tax_base_land"
        value={inputs.property_tax_base_land}
        onChange={onChange}
        error={errors?.property_tax_base_land}
      />
      <Input
        label="固定資産税課税標準額 (建物)"
        unit="万円"
        name="property_tax_base_building"
        value={inputs.property_tax_base_building}
        onChange={onChange}
        error={errors?.property_tax_base_building}
      />
      <h1 className="text-xl font-semibold">融資</h1>
      <Input
        label="借入金額"
        unit="万円"
        name="principal"
        value={inputs.principal}
        onChange={onChange}
        error={errors?.principal}
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
      <h1 className="text-xl font-semibold">税金</h1>
      <Input
        label="法人税率"
        unit="%"
        step={0.01}
        name="tax_rate"
        value={inputs.tax_rate}
        onChange={onChange}
        error={errors?.tax_rate}
      />
      <h1 className="text-xl font-semibold">大規模修繕費</h1>
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
