import React from "react"
import QuestionMark from "./svg/QuestionMark"

const ToolTip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="group relative flex justify-center">
      <QuestionMark size={20} />
      <span className="absolute top-[-6px] left-[30px] scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {children}
      </span>
    </div>
  )
}

export default ToolTip
