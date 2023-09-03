export function sum(xs: number[]) {
  let y = 0
  for (let i = 0; i < xs.length; i++) {
    y += xs[i]
  }
  return y
}

export function integrate(xs: number[]): number[] {
  let y = 0
  const ys: number[] = []
  for (let i = 0; i < xs.length; i++) {
    y += xs[i]
    ys.push(y)
  }
  return ys
}

export function padd<A>(xs: A[], n: number, x: A): A[] {
  if (xs.length < n) {
    const d = n - xs.length
    for (let i = 0; i < d; i++) {
      xs.push(x)
    }
  }
  return xs
}

export function chunk<A>(xs: A[], n: number): A[][] {
  const chunks = []
  for (let i = 0; i < xs.length; i += n) {
    chunks.push(xs.slice(i, i + n))
  }
  return chunks
}

// @ts-ignore
export function pipe<A>(xs: A[], ...funcs) {
  let res = xs
  for (let i = 0; i < funcs.length; i++) {
    res = funcs[i](res)
  }
  return res
}
