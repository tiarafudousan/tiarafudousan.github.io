import React from "react"
import { CashFlowData } from "../lib/cf"

const Color: React.FC<{ num: number }> = ({ num }) => {
  return <span className={num >= 0 ? "" : "text-red-500"}>{num}</span>
}

const Row: React.FC<{
  row_span?: number
  header?: string
  text: string
  bg_color?: string
  data: CashFlowData[]
  get: (d: CashFlowData) => number
}> = ({ row_span = 0, header = "", text, bg_color = "", data, get }) => {
  return (
    <tr className={bg_color}>
      {row_span >= 1 ? (
        <th
          className="bg-white font-semibold border border-slate-300 text-left px-2 align-top whitespace-nowrap"
          rowSpan={row_span}
        >
          {header}
        </th>
      ) : null}
      <th className="font-medium border border-r-4 border-slate-300 text-left px-2 whitespace-nowrap">
        {text}
      </th>
      {data.map((d, i) => (
        <td key={i} className="border border-slate-300 px-2 text-right">
          <Color num={get(d)} />
        </td>
      ))}
    </tr>
  )
}

// TODO: sticky columns - freeze first 2 columns
// TODO: hover info
const CashFlowTable: React.FC<{ data: CashFlowData[] }> = ({ data }) => {
  return (
    <table className="text-sm border-collapse border border-slate-300 w-[600px] overflow-x-auto">
      <thead>
        <tr>
          <th className=""></th>
          <th className="border-slate-300 border-r-4"></th>
          {data.map((_, i) => (
            <td key={i} className="border border-slate-300 text-center">
              {i + 1}
            </td>
          ))}
          <td></td>
        </tr>
      </thead>

      <tbody>
        <Row
          row_span={2}
          header="収入"
          text="GPI"
          data={data}
          get={(d) => d.gpi}
        />
        <Row
          text="EGI"
          bg_color="bg-blue-100"
          data={data}
          get={(d) => Math.floor(d.egi)}
        />

        <Row
          row_span={9}
          header="OPEX"
          text="固定資産税"
          data={data}
          get={(d) => Math.floor(d.property_tax)}
        />
        <Row
          text="都市計画税 "
          data={data}
          get={(d) => Math.floor(d.city_planning_tax)}
        />
        <Row
          text="管理費"
          data={data}
          get={(d) => Math.floor(d.maintanence_fee)}
        />
        <Row
          text="修繕費"
          data={data}
          get={(d) => Math.floor(d.restoration_fee)}
        />
        <Row text="広告費" data={data} get={(d) => Math.floor(d.ad_fee)} />
        <Row
          text="保険料"
          data={data}
          get={(d) => Math.floor(d.insurance_fee)}
        />
        <Row
          text="他運用費"
          data={data}
          get={(d) => Math.floor(d.opex_misc_fee)}
        />
        <Row
          text="初年度経費"
          data={data}
          get={(d) => Math.floor(d.initial_cost)}
        />
        <Row
          text="OPEX"
          bg_color="bg-blue-100"
          data={data}
          get={(d) => Math.floor(d.opex)}
        />

        <Row
          row_span={3}
          header="BTCF"
          text="NOI"
          data={data}
          get={(d) => Math.floor(d.noi)}
        />
        <Row text="ADS" data={data} get={(d) => Math.floor(d.ads)} />
        <Row
          text="BTCF"
          bg_color="bg-blue-100"
          data={data}
          get={(d) => Math.floor(d.btcf)}
        />
        <Row
          row_span={6}
          header="ATCF"
          text="減価償却 建物"
          data={data}
          get={(d) => Math.floor(d.building_depreciation)}
        />
        <Row
          text="減価償却 設備"
          data={data}
          get={(d) => Math.floor(d.equipment_depreciation)}
        />
        <Row text="元金" data={data} get={(d) => Math.floor(d.principal)} />
        <Row
          text="所得"
          data={data}
          get={(d) => Math.floor(d.taxable_income)}
        />
        <Row text="税金" data={data} get={(d) => Math.floor(d.tax)} />
        <Row
          text="ATCF"
          bg_color="bg-blue-100"
          data={data}
          get={(d) => Math.floor(d.atcf)}
        />
        <Row
          row_span={2}
          header="CCR"
          text="FCR"
          data={data}
          get={(d) => Math.round(d.fcr * 1000) / 1000}
        />
        <Row
          text="CCR"
          data={data}
          get={(d) => Math.round(d.ccr * 1000) / 1000}
        />
      </tbody>
    </table>
  )
}

export default CashFlowTable
