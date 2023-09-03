import { Inputs } from "./form"
import { padd, chunk, sum, pipe } from "./utils"
import * as loan_lib from "./loan"

// 構造
// 鉄筋コンクリート
export const RC = "RC"
// 鉄骨鉄筋コンクリート
export const SRC = "SRC"
// 重量鉄骨
export const HGS = "HGS"
// 鉄骨
export const S = "S"
// 軽量鉄骨 3mm超4mm未満
export const LGS = "LGS"
// 木造
export const WOOD = "WOOD"

export type BuildingType = "RC" | "SRC" | "HGS" | "S" | "LGS" | "WOOD"

// 再調達価格
export const REPLACEMENT_COSTS: { [key: string]: [number, number] } = {
  RC: [16, 20],
  SRC: [16, 20],
  S: [13, 18],
  HGS: [13, 18],
  LGS: [12, 17],
  WOOD: [10, 16],
}

// 法定耐用年数
export const LEGAL_DURATIONS: { [key: string]: number } = {
  RC: 47,
  SRC: 47,
  S: 34,
  HGS: 34,
  LGS: 19,
  WOOD: 22,
}

//  建物の積算価格
function estimate_building_price(args: {
  type: BuildingType
  age: number
  area: number
}): [number, number] {
  /*
    ■築年数が法定耐用年数内の物件の場合
    再調達価格 x 建物面積 x (法定耐用年数 - 築年数) ÷ 法定耐用年数

    ■築年数が法定耐用年数を超過した物件の場合
    0
    */
  const building_type = args.type
  const age = args.age
  const area = args.area

  const legal_duration = LEGAL_DURATIONS[building_type]
  const cost = REPLACEMENT_COSTS[building_type]

  if (age < legal_duration) {
    return [
      Math.floor((cost[0] * area * (legal_duration - age)) / legal_duration),
      Math.floor((cost[1] * area * (legal_duration - age)) / legal_duration),
    ]
  }

  return [0, 0]
}

export interface SimData {
  total_cash_in: number
  total_debt_payment: number
  monthly_debt_payment: number
  monthly_repayment_ratio: number
  // Monthly cash in before debt payment
  monthly_cash_in: number
  yearly_cash_out: number
  yearly_cash_flow: number
  // 表面利回り
  gross_yield: number
  // 実質利回り
  real_yield: number
  gpi: number
  egi: number
  opex: number
  ccr: number
  noi: number
  capex: number
  ncf: number
  ads: number
  btcf: number
}

const YEARS = 30

// TODO: detailed opex
export function simulate(inputs: Inputs<number>): SimData {
  const gpi = Math.floor(inputs.gpi)
  const vacancy_rate = inputs.vacancy_rate / 100
  const opex_rate = inputs.opex_rate / 100

  const cash = Math.floor(inputs.cash)
  const principal = Math.floor(inputs.principal)
  const n = inputs.years * 12
  const interest_rate = inputs.interest_rate / (100 * 12)

  // Cash in
  const egi = gpi * (1 - vacancy_rate)
  const monthly_cash_in = egi / 12

  // property_price + cost = cash +  principal
  const total_cash_in = cash + principal

  // Loan
  const monthly_debt_payment =
    n > 0
      ? loan_lib.calc_fixed_rate_loan_monthly_payment(
          principal,
          interest_rate,
          n,
        )
      : 0
  const monthly_repayment_ratio =
    monthly_cash_in > 0 ? monthly_debt_payment / monthly_cash_in : 1
  const total_debt_payment = n * monthly_debt_payment

  // Cash flow
  const opex = gpi * opex_rate
  const yearly_cash_out = monthly_debt_payment * 12 + opex
  const yearly_cash_flow = egi - yearly_cash_out

  const loan_sim = loan_lib.sim_fixed_rate_loan(principal, interest_rate, n)
  // const principals = padd(loan_sim.principals, YEARS * 12, 0)
  const principals = pipe(
    loan_sim.principals,
    (xs: number[]) => padd(xs, YEARS * 12, 0),
    (xs: number[]) => chunk(xs, 12),
    (xs: number[][]) => xs.map(sum),
  )
  const debt_repayments = pipe(
    loan_sim.debt_repayments,
    (xs: number[]) => padd(xs, YEARS * 12, 0),
    (xs: number[]) => chunk(xs, 12),
    (xs: number[][]) => xs.map(sum),
  )
  const interests = pipe(
    loan_sim.interests,
    (xs: number[]) => padd(xs, YEARS * 12, 0),
    (xs: number[]) => chunk(xs, 12),
    (xs: number[][]) => xs.map(sum),
  )

  const gross_yield = gpi / total_cash_in
  const real_yield = yearly_cash_flow / total_cash_in
  const ccr = cash > 0 ? yearly_cash_flow / cash : 1
  const noi = egi - opex
  // TODO: capex
  const capex = 0
  const ncf = noi - capex
  // TODO: get ads of a particula year
  const ads = debt_repayments[0]
  const btcf = ncf - ads

  // TODO: delta gpi

  return {
    total_cash_in,
    total_debt_payment,
    monthly_debt_payment,
    monthly_repayment_ratio,
    monthly_cash_in,
    yearly_cash_out,
    yearly_cash_flow,
    gross_yield,
    real_yield,
    gpi,
    egi,
    opex,
    ccr,
    noi,
    capex,
    ncf,
    ads,
    btcf,
    // TODO: atcf, fcr, ccr
  }
}
