import React from "react"

function append(c1: string, c2: string, bool: boolean) {
  if (bool) {
    return `${c1} ${c2}`
  }
  return c1
}

interface Props {
  label: string
  unit: string
  step?: number
  name: string
  value: string
  onChange?: (name: string, value: string) => void
  error?: string
  disabled?: boolean
}

const Input: React.FC<Props> = ({
  label,
  unit,
  step = 1,
  name,
  value,
  onChange,
  error,
  disabled,
}) => {
  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(name, e.target.value)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center py-1">
        <label className="w-[120px] mr-2">{label}</label>
        <input
          className={append(
            "w-[100px] px-2 py-0.5 text-right bg-gray-200 disabled:bg-white disabled:border-white border border-gray-100 focus:outline-none focus:ring focus:ring-blue-200 rounded-sm",
            "bg-red-100 border-red-200",
            !!error,
          )}
          type="number"
          min={0}
          step={step}
          value={value}
          onChange={_onChange}
          disabled={disabled}
        />
        <div className="ml-2">{unit}</div>
      </div>
      <div className="text-sm text-red-500 h-[20px]">{error}</div>
    </div>
  )
}

export default Input
