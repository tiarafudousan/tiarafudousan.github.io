import React from "react"
import { CashFlowData } from "../lib/cf"
import Yen from "./Yen"
import Percent from "./Percent"

const CashFlowTree: React.FC<{ data: CashFlowData }> = ({ data }) => {
  return (
    <>
      <div className="text-xl font-semibold mb-2">収支試算</div>
      <table className="w-full">
        <tbody>
          <tr>
            <td>総事業費</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.total_invested} />
            </td>
          </tr>
          <tr>
            <td>返済総額</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.total_debt_payment} />
            </td>
          </tr>
          <tr>
            <td>現金</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.cash} />
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>表面利回り</td>
            <td style={{ textAlign: "right" }}>
              <Percent num={data.gross_yield} />
            </td>
          </tr>
          <tr>
            <td>GPI</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.gpi} />
            </td>
          </tr>
          <tr>
            <td>EGI</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.egi} />
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>EGI (月)</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.egi / 12} />
            </td>
          </tr>
          <tr>
            <td>固定資産税</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.property_tax} />
            </td>
          </tr>
          <tr>
            <td>都市計画税</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.city_planning_tax} />
            </td>
          </tr>
          <tr>
            <td>管理費</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.maintanence_fee} />
            </td>
          </tr>
          <tr>
            <td>OPEX</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.opex} />
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>OPEX (月)</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.opex / 12} />
            </td>
          </tr>
          <tr>
            <td>NOI</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.noi} />
            </td>
          </tr>
          <tr>
            <td>NOI (月)</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.noi / 12} />
            </td>
          </tr>
          <tr>
            <td>ADS</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.ads} />
            </td>
          </tr>
          <tr>
            <td>ADS (月)</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.ads / 12} />
            </td>
          </tr>
          <tr>
            <td>返済比率</td>
            <td style={{ textAlign: "right" }}>
              <Percent num={data.egi > 0 ? data.ads / data.egi : 1} />
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>BTCF</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.btcf} />
            </td>
          </tr>
          <tr>
            <td>減価償却 (建物)</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.building_depreciation} />
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
            <td style={{ textAlign: "right" }}>
              <Yen num={data.principal} />
            </td>
          </tr>
          <tr>
            <td>申告所得</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.taxable_income} />
            </td>
          </tr>
          <tr>
            <td>税金</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.tax} />
            </td>
          </tr>
          <tr className="border-b-2 border-gray-200">
            <td>ATCF</td>
            <td style={{ textAlign: "right" }}>
              <Yen num={data.atcf} />
            </td>
          </tr>
          <tr>
            <td>K</td>
            <td style={{ textAlign: "right" }}>
              <Percent num={data.k} />
            </td>
          </tr>
          <tr>
            <td>FCR</td>
            <td style={{ textAlign: "right" }}>
              <Percent num={data.fcr} />
            </td>
          </tr>
          <tr>
            <td>CCR</td>
            <td style={{ textAlign: "right" }}>
              <Percent num={data.ccr} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default CashFlowTree
