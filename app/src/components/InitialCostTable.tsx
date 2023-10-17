import React from "react"
import { yen } from "../lib/format"
import { InitialCost } from "../lib/cf"

interface Props {
  data: InitialCost
}

const InitialCostTable: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="text-xl font-semibold mb-2">購入費</div>
      <table className="w-full">
        <tbody>
          <tr>
            <td>消費税 物件</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.building_sales_tax)} 円
            </td>
          </tr>
          <tr>
            <td>印紙代 売買契約</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.stamp_tax_real_estate)} 円
            </td>
          </tr>
          <tr>
            <td>印紙代 金消契約</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.stamp_tax_bank)} 円
            </td>
          </tr>
          <tr>
            <td>抵当権設定費</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.mortgage_registration_tax)} 円
            </td>
          </tr>
          <tr>
            <td>所有権移転登録免許税 (土地)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.registration_license_tax_land)} 円
            </td>
          </tr>
          <tr>
            <td>所有権移転登録免許税 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.registration_license_tax_building)} 円
            </td>
          </tr>
          <tr>
            <td>司法書士費</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.judicial_scrivener_fee)} 円
            </td>
          </tr>
          <tr>
            <td>仲介手数料</td>
            <td style={{ textAlign: "right" }}>{yen(data.brokerage_fee)} 円</td>
          </tr>
          <tr>
            <td>不動産取得税 (土地)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.real_estate_acquisition_tax_land)} 円
            </td>
          </tr>
          <tr>
            <td>不動産取得税 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.real_estate_acquisition_tax_building)} 円
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>諸経費</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.purchase_misc_fee)} 円
            </td>
          </tr>
          <tr>
            <td>合計</td>
            <td style={{ textAlign: "right" }}>{yen(data.total)} 円</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default InitialCostTable
