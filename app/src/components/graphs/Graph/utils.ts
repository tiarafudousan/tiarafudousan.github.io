import { Point } from "./canvas/types"

export function xy(arr: number[], x0 = 0, y0 = 0): Point[] {
  return arr.map((y, x) => ({
    x: x + x0,
    y: y + y0,
  }))
}
