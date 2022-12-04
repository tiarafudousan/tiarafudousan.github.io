import React from "react"

interface Props {
  label: string
  unit: string
  name: string
  value: string
  onChange: (name: string, value: string) => void
}

const Input: React.FC<Props> = ({ label, unit, name, value, onChange }) => {
  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(name, e.target.value)
  }

  return (
    <div className="flex flex-row items-center py-1">
      <label className="w-[120px] mr-2">{label}</label>
      <input
        className="w-[100px] px-2 py-0.5 text-right border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 rounded-sm"
        type="number"
        min={0}
        value={value}
        onChange={_onChange}
      />
      <div className="ml-2">{unit}</div>
    </div>
  )
}

export default Input
