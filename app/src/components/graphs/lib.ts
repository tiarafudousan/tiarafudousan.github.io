export function lerp(p0: number, p1: number, t: number): number {
  // 0 <= t <= 1
  return p0 * (1 - t) + p1 * t
}

export function lin(dy: number, dx: number, x: number, y0: number): number {
  return (dy / dx) * x + y0
}

export function bound(x: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, x))
}
