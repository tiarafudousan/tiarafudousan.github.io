export function yen(value: number): string {
  return Math.round(value * 10000).toLocaleString()
}

export function percent(value: number): string {
  return (value * 100).toFixed(2)
}
