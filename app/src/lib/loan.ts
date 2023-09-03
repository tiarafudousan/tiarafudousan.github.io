import { padd, chunk, sum, pipe } from "./utils"

const YEARS = 30

function agg(xs: number[]): number[] {
  return pipe(
    xs,
    (xs: number[]) => padd(xs, YEARS * 12, 0),
    (xs: number[]) => chunk(xs, 12),
    (xs: number[][]) => xs.map(sum),
  )
}

// 元金均等返済 - fixed principal
export function calc_fix_principal_loan_total_payment(
  p: number,
  r: number,
  n: number,
): number {
  return p + p * (((n + 1) / 2) * r)
}

export function sim_fixed_principal_loan(p: number, r: number, n: number) {
  const principals = []
  const interests = []
  // principal + interest
  const debt_repayments = []

  let total_payment = 0
  let debt = p
  let payment = p / n
  let interest = p * r

  for (let i = 0; i < n; i++) {
    interests.push(interest)
    principals.push(payment)
    debt_repayments.push(payment + interest)

    total_payment += payment + interest
    debt -= payment
    interest = debt * r
  }

  return {
    principals: agg(principals),
    interests: agg(interests),
    debt_repayments: agg(debt_repayments),
    total_payment: total_payment,
    interest: total_payment - p,
    payment_to_loan_ratio: total_payment / p,
  }
}

// 元利均等返済 - fixed-rate payment
export function calc_fixed_rate_loan_monthly_payment(
  p: number,
  r: number,
  n: number,
): number {
  // p = principle
  // n = number of months
  // r = interest per year / 12
  return (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}

export interface FixedRateLoan {
  principals: number[]
  interests: number[]
  debt_repayments: number[]
  monthly_payment: number
  total_payment: number
  interest: number
  payment_to_loan_ratio: number
}

export function sim_fixed_rate_loan(
  p: number,
  r: number,
  n: number,
): FixedRateLoan {
  const principals = []
  const interests = []
  // principal + interest
  const debt_repayments = []

  const x = calc_fixed_rate_loan_monthly_payment(p, r, n)

  let debt = p
  let interest = p * r

  for (let i = 0; i < n; i++) {
    interests.push(interest)
    principals.push(x - interest)
    debt_repayments.push(x)

    debt -= x - interest
    interest = debt * r
  }

  return {
    principals: agg(principals),
    interests: agg(interests),
    debt_repayments: agg(debt_repayments),
    monthly_payment: x,
    total_payment: x * n,
    interest: x * n - p,
    payment_to_loan_ratio: (x * n) / p,
  }
}
