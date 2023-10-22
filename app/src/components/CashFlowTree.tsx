import React from "react"
import { yen, percent } from "../lib/format"
import { CashFlowData } from "../lib/cf"

interface Props {
  data: CashFlowData
}

const CashFlowTree: React.FC<Props> = ({ data }) => {
  return (
    <>
      <div className="text-xl font-semibold mb-2">収支試算</div>
      <table className="w-full">
        <tbody>
          <tr>
            <td>総投資額</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.total_invested)} 円
            </td>
          </tr>
          <tr>
            <td>表面利回り</td>
            <td style={{ textAlign: "right" }}>
              {percent(data.gross_yield)} %
            </td>
          </tr>
          <tr>
            <td>現金</td>
            <td style={{ textAlign: "right" }}>{yen(data.cash)} 円</td>
          </tr>
          <tr>
            <td>返済総額</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.total_debt_payment)} 円
            </td>
          </tr>
          <tr>
            <td>EGI (月)</td>
            <td style={{ textAlign: "right" }}>{yen(data.egi / 12)} 円</td>
          </tr>
          <tr>
            <td>NOI (月)</td>
            <td style={{ textAlign: "right" }}>{yen(data.noi / 12)} 円</td>
          </tr>
          <tr>
            <td>OPEX (月)</td>
            <td style={{ textAlign: "right" }}>{yen(data.opex / 12)} 円</td>
          </tr>
          <tr>
            <td>ADS (月)</td>
            <td style={{ textAlign: "right" }}>{yen(data.ads / 12)} 円</td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>返済比率</td>
            <td style={{ textAlign: "right" }}>
              {percent(data.egi > 0 ? data.ads / data.egi : 1)} %
            </td>
          </tr>
          <tr>
            <td>GPI</td>
            <td style={{ textAlign: "right" }}>{yen(data.gpi)} 円</td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>EGI</td>
            <td style={{ textAlign: "right" }}>{yen(data.egi)} 円</td>
          </tr>
          <tr>
            <td>固定資産税 (土地)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.property_tax_land)} 円
            </td>
          </tr>
          <tr>
            <td>固定資産税 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.property_tax_building)} 円
            </td>
          </tr>
          <tr>
            <td>都市計画税 (土地)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.city_planning_tax_land)} 円
            </td>
          </tr>
          <tr>
            <td>都市計画税 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.city_planning_tax_building)} 円
            </td>
          </tr>
          <tr>
            <td>管理費</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.maintanence_fee)} 円
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>OPEX</td>
            <td style={{ textAlign: "right" }}>{yen(data.opex)} 円</td>
          </tr>
          <tr>
            <td>NOI</td>
            <td style={{ textAlign: "right" }}>{yen(data.noi)} 円</td>
          </tr>
          <tr>
            <td>ADS</td>
            <td style={{ textAlign: "right" }}>{yen(data.ads)} 円</td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>BTCF</td>
            <td style={{ textAlign: "right" }}>{yen(data.btcf)} 円</td>
          </tr>
          <tr>
            <td>減価償却 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.building_depreciation)} 円
            </td>
          </tr>
          <tr>
            <td>減価償却年数 (建物)</td>
            <td style={{ textAlign: "right" }}>
              {data.building_depreciation_period} 年
            </td>
          </tr>
          <tr>
            <td>元金返済</td>
            <td style={{ textAlign: "right" }}>{yen(data.principal)} 円</td>
          </tr>
          <tr>
            <td>申告所得</td>
            <td style={{ textAlign: "right" }}>
              {yen(data.taxable_income)} 円
            </td>
          </tr>
          <tr>
            <td>税金</td>
            <td style={{ textAlign: "right" }}>{yen(data.tax)} 円</td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>ATCF</td>
            <td style={{ textAlign: "right" }}>{yen(data.atcf)} 円</td>
          </tr>
          <tr>
            <td>K</td>
            <td style={{ textAlign: "right" }}>{percent(data.k)} %</td>
          </tr>
          <tr>
            <td>FCR</td>
            <td style={{ textAlign: "right" }}>{percent(data.fcr)} %</td>
          </tr>
          <tr>
            <td>CCR</td>
            <td style={{ textAlign: "right" }}>{percent(data.ccr)} %</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default CashFlowTree
