import React, { useState } from "react"
import Input from "./Input"

// TODO: 積算価格
const PriceEstimator: React.FC<{}> = ({}) => {
  const [inputs, setInputs] = useState({
    inheritance_tax_value: "0",
    land_area: "0",
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
      | React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()
  }

  const land_val =
    parseInt(inputs.inheritance_tax_value) * parseInt(inputs.land_area)
  const val = land_val / 0.8
  const min_market_land_val = val / 0.9
  const max_market_land_val = val / 0.5

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Input
          label="相続税路線価"
          unit="万円"
          name="inheritance_tax_value"
          value={inputs.inheritance_tax_value}
          onChange={onChange}
        />
        <Input
          label="土地面積"
          unit="㎡"
          name="land_area"
          value={inputs.land_area}
          onChange={onChange}
        />
      </form>
      <table>
        <tbody>
          <tr>
            <td className="px-2">土地評価額</td>
            <td align="right">{Math.floor(land_val).toLocaleString()} 万円</td>
          </tr>
          <tr>
            <td className="px-2">公示価格</td>
            <td align="right">{Math.floor(val).toLocaleString()} 万円</td>
          </tr>
          <tr>
            <td className="px-2">実勢価格</td>
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
