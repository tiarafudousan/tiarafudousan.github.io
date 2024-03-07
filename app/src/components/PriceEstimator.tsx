import React, { useState } from "react"
import { BUILDING_OPTIONS } from "../constants"
import Select from "./Select"
import Input from "./Input"
import { estimate_building_price, BuildingType } from "../lib/building"

const PriceEstimator: React.FC<{}> = ({}) => {
  const [inputs, setInputs] = useState({
    building_type: "WOOD",
    building_age: "0",
    inheritance_tax_value: "0",
    land_area: "0",
    building_area: "0",
  })

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

  function onSubmit(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()
  }

  const inheritance_tax_land_val =
    parseInt(inputs.inheritance_tax_value) * parseInt(inputs.land_area)
  const land_val = inheritance_tax_land_val / 0.8
  const min_market_land_val = land_val / 0.9
  const max_market_land_val = land_val / 0.5

  const [min_building_val, max_building_val] = estimate_building_price({
    type: inputs.building_type as BuildingType,
    age: parseInt(inputs.building_age),
    building_area: parseInt(inputs.building_area),
  })

  return (
    <div>
      <form onSubmit={onSubmit}>
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
        />
        <Input
          label="土地面積"
          unit="㎡"
          name="land_area"
          value={inputs.land_area}
          onChange={onChange}
        />
        <Input
          label="建物面積"
          unit="㎡"
          name="building_area"
          value={inputs.building_area}
          onChange={onChange}
        />
        <Input
          label="相続税路線価"
          unit="万円"
          name="inheritance_tax_value"
          value={inputs.inheritance_tax_value}
          onChange={onChange}
        />
      </form>
      <table>
        <tbody>
          <tr>
            <td className="px-2">建物 積算価格</td>
            <td align="right">
              {Math.floor(min_building_val).toLocaleString()} ~{" "}
              {Math.floor(max_building_val).toLocaleString()} 万円
            </td>
          </tr>
          <tr>
            <td className="px-2">土地 積算価格</td>
            <td align="right">
              {Math.floor(inheritance_tax_land_val).toLocaleString()} 万円
            </td>
          </tr>
          <tr>
            <td className="px-2">積算価格</td>
            <td align="right">
              {Math.floor(
                min_building_val + inheritance_tax_land_val,
              ).toLocaleString()}{" "}
              ~{" "}
              {Math.floor(
                max_building_val + inheritance_tax_land_val,
              ).toLocaleString()}{" "}
              万円
            </td>
          </tr>
          <tr>
            <td className="px-2">土地 公示価格</td>
            <td align="right">{Math.floor(land_val).toLocaleString()} 万円</td>
          </tr>
          <tr>
            <td className="px-2">土地 実勢価格</td>
            <td align="right">
              {Math.floor(min_market_land_val).toLocaleString()} ~{" "}
              {Math.floor(max_market_land_val).toLocaleString()} 万円
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PriceEstimator
