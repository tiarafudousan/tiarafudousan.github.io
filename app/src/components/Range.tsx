import React from "react"

const Range: React.FC<{
  label: string
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}> = ({ label, min, max, value, onChange }) => {
  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(e.target.value)
    onChange(value)
  }

  return (
    <>
      <label>
        {label} {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={0.1}
        onChange={_onChange}
        value={value}
      />
    </>
  )
}

export default Range
