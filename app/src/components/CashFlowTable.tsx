import React from "react"
import { CashFlowData } from "../lib/cf"

const Color: React.FC<{ num: number }> = ({ num }) => {
  return <span className={num >= 0 ? "" : "text-red-500"}>{num}</span>
}

const RowSpan: React.FC<{
  rowSpan: number
  header: string
  rows: {
    text: string
    get: (d: CashFlowData) => number
  }[]
}> = ({ rowSpan, header, rows }) => {
  return (
    <>
      <tr>
        <th rowSpan={rowSpan}>{header}</th>
        <td>555-1234</td>
      </tr>
      <tr>
        <td>555-8745</td>
      </tr>
    </>
  )
}

interface Props {
  data: CashFlowData[]
}

// TODO: sticky columns - freeze first 2 columns
const CashFlowTable: React.FC<Props> = ({ data }) => {
  function row({
    rowSpan = 0,
    header = "",
    text,
    get,
    backgroundColor = "",
  }: {
    rowSpan?: number
    header?: string
    text: string
    get: (d: CashFlowData) => number
    backgroundColor?: string
  }) {
    return (
      <tr className={backgroundColor}>
        {rowSpan >= 1 ? (
          <th
            className="font-semibold border border-slate-300 text-left px-2 align-top whitespace-nowrap"
            rowSpan={rowSpan}
          >
            {header}
          </th>
        ) : null}
        <th className="font-medium border border-slate-300 text-left px-2 whitespace-nowrap">
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

  return (
    <table className="text-sm border-collapse border border-slate-300 w-[600px] overflow-x-auto">
      <thead>
        <tr>
          <th className=""></th>
          <th className=""></th>
          {data.map((_, i) => (
            <td key={i} className="border border-slate-300 text-center">
              {i}
            </td>
          ))}
          <td></td>
        </tr>
      </thead>

      <tbody>
        {row({ rowSpan: 2, header: "収入", text: "GPI", get: (d) => d.gpi })}
        {row({
          text: "EGI",
          get: (d) => Math.floor(d.egi),
          backgroundColor: "bg-blue-100",
        })}

        {row({
          rowSpan: 4,
          header: "費用",
          text: "固定資産税",
          get: (d) => Math.floor(d.property_tax),
        })}
        {row({
          text: "都市計画税 ",
          get: (d) => Math.floor(d.city_planning_tax),
        })}
        {row({
          text: "管理費",
          get: (d) => Math.floor(d.maintanence_fee),
        })}
        {/* TODO: ad fee, restoration fee, insurance fee, opex misc fee, initial cost */}
        {row({
          text: "OPEX",
          get: (d) => Math.floor(d.opex),
          backgroundColor: "bg-blue-100",
        })}

        {row({
          rowSpan: 3,
          header: "BTCF",
          text: "NOI",
          get: (d) => Math.floor(d.noi),
        })}
        {row({
          text: "ADS",
          get: (d) => Math.floor(d.ads),
        })}
        {row({ text: "BTCF", get: (d) => Math.floor(d.btcf) })}
        {row({
          rowSpan: 1,
          header: "ATCF",
          text: "ATCF",
          get: (d) => Math.floor(d.atcf),
        })}
      </tbody>
    </table>
  )
}

export default CashFlowTable
