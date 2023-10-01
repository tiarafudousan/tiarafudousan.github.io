import React from "react"

interface Props {
  size: number
  className?: string
  color?: string
  fill?: boolean
}

const Circle: React.FC<Props> = ({
  size,
  className = "",
  color = "",
  fill = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill={color}
    >
      {fill ? (
        <circle cx={8} cy={8} r={8} />
      ) : (
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      )}
    </svg>
  )
}

export default Circle
