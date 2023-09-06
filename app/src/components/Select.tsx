import React from "react"

interface Props {
  value: string
  options: { value: string; text: string }[]
  onChange: (value: string) => void
}

const Select: React.FC<Props> = ({ value, options, onChange }) => {
  function _onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value)
  }

  return (
    <select
      className="bg-gray-200 border border-gray-300 text-gray-900 text-lg rounded-md border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 p-1"
      value={value}
      onChange={_onChange}
    >
      {options.map(({ value, text }) => (
        <option key={value} value={value}>
          {text}
        </option>
      ))}
    </select>
  )
}

export default Select
