import React from "react"
import { yen } from "../lib/format"

interface Props {
  num: number
}

const Yen: React.FC<Props> = ({ num }) => {
  if (num >= 0) {
    return <span>{yen(num)} 円</span>
  }
  return <span className="text-red-500">{yen(num)} 円</span>
}

export default Yen
