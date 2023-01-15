import { Box } from "./types"

export function stepBelow(x: number, step: number): number {
  return x - (x % step)
}

export function findNearestIndex(arr: number[], x: number): number {
  let low = 0
  let high = arr.length - 1

  if (arr.length <= 1) {
    return high
  }

  if (arr[low] > arr[high]) {
    throw new Error("Data must be sorted in ascending order")
  }

  // binary search
  while (low < high) {
    let mid = ((low + high) / 2) >> 0

    if (arr[mid] > x) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  // TODO: what?
  if (arr[low - 1] !== undefined) {
    const midX = (arr[low] + arr[low - 1]) / 2

    if (x < midX) {
      return low - 1
    } else {
      return low
    }
  }

  return low
}

export function isInside(
  box: Box,
  point: { x: number | undefined; y: number | undefined }
): boolean {
  const { x, y } = point

  if (!x || x < box.left || x > box.left + box.width) {
    return false
  }

  if (!y || y < box.top || y > box.top + box.height) {
    return false
  }

  return true
}

// TODO: lerp
export function linear(dy: number, dx: number, x: number, y0: number): number {
  return (dy / dx) * x + y0
}

export function getCanvasX(
  width: number,
  left: number,
  xMax: number,
  xMin: number,
  x: number
): number {
  const dx = xMax - xMin

  return linear(width, dx, x, left - (width * xMin) / dx)
}

export function getCanvasY(
  height: number,
  top: number,
  yMax: number,
  yMin: number,
  y: number
): number {
  const dy = yMax - yMin

  return linear(-height, dy, y, top + (height * yMax) / dy)
}

export function getX(
  width: number,
  left: number,
  xMax: number,
  xMin: number,
  canvasX: number
): number {
  const dx = xMax - xMin

  return linear(dx, width, canvasX, xMin - (dx / width) * left)
}

export function getY(
  height: number,
  top: number,
  yMax: number,
  yMin: number,
  canvasY: number
): number {
  const dy = yMax - yMin

  return linear(-dy, height, canvasY, yMax + (dy / height) * top)
}
