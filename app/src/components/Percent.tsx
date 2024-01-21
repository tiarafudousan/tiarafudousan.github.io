import React from "react"
import { percent } from "../lib/format"

interface Props {
  num: number
}

const Percent: React.FC<Props> = ({ num }) => {
  if (num >= 0) {
    return <span>{percent(num)} %</span>
  }
  return <span className="text-red-500">{percent(num)} %</span>
}

export default Percent
