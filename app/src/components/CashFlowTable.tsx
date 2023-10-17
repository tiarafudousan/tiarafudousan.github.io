import React from "react"
import { CashFlowData } from "../lib/cf"

interface Props {
  data: CashFlowData[]
}

const CashFlowTable: React.FC<Props> = ({ data }) => {
  function color(x: number) {
    return <span className={x >= 0 ? "" : "text-red-500"}>{x}</span>
  }

  function row(text: string, get: (d: CashFlowData) => number) {
    return (
      <tr>
        <th className="border border-slate-300 text-left px-2">{text}</th>
        {data.map((d, i) => (
          <td key={i} className="border border-slate-300 px-2 text-right">
            {color(get(d))}
          </td>
        ))}
      </tr>
    )
  }

  return (
    <table className="border-collapse border border-slate-300">
      <tbody>
        <tr>
          <th></th>
          {data.map((_, i) => (
            <td key={i} className="border border-slate-300 text-center">
              {i}
            </td>
          ))}
          <td></td>
        </tr>
        {row("GPI", (d) => d.gpi)}
        {row("EGI", (d) => Math.floor(d.egi))}
        {row("OPEX", (d) => Math.floor(d.opex))}
        {row("NOI", (d) => Math.floor(d.noi))}
        {row("ADS", (d) => Math.floor(d.ads))}
        {row("BTCF", (d) => Math.floor(d.btcf))}
        {row("ATCF", (d) => Math.floor(d.atcf))}
      </tbody>
    </table>
  )
}

export default CashFlowTable
