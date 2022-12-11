import { Inputs } from "./types"

// 毎月返済額の計算 - 元利均等返済
function calc_monthly_debt_payment(p: number, r: number, n: number) {
  return (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}

function calc_yearly_expense(
  yearly_income: number,
  vacancy_rate: number,
  running_cost_rate: number
) {
  return yearly_income * (vacancy_rate + running_cost_rate)
}

function calc_yearly_payment(
  monthly_debt_payment: number,
  yearly_expense: number
) {
  return monthly_debt_payment * 12 + yearly_expense
}

function calc_yearly_profit(
  yearly_income: number,
  monthly_debt_payment: number,
  yearly_expense: number
) {
  return yearly_income - monthly_debt_payment * 12 - yearly_expense
}

function calc_gross_yield(property_price: number, yearly_income: number) {
  return yearly_income / property_price
}

function calc_real_yield(
  property_price: number,
  yearly_income: number,
  yearly_expense: number
) {
  return (yearly_income - yearly_expense) / property_price
}

function calc_yield_after_repayment(
  property_price: number,
  yearly_profit: number
) {
  return yearly_profit / property_price
}

function calc_ccr(yearly_profit: number, cash: number) {
  if (cash == 0) {
    return 1
  }
  return yearly_profit / cash
}

export function simulate(inputs: Inputs<number>) {
  const property_price = Math.floor(inputs.property_price)
  const yearly_income = Math.floor(inputs.yearly_income)
  const vacancy_rate = inputs.vacancy_rate / 100
  const running_cost_rate = inputs.running_cost_rate / 100

  const cash = Math.floor(inputs.cash)
  const loan = Math.floor(inputs.loan)
  const n = inputs.years * 12
  const interest_rate = inputs.interest_rate / 12

  const monthly_debt_payment = calc_monthly_debt_payment(loan, interest_rate, n)
  const yearly_expense = calc_yearly_expense(
    yearly_income,
    vacancy_rate,
    running_cost_rate
  )
  const yearly_payment = calc_yearly_payment(
    monthly_debt_payment,
    yearly_expense
  )
  const yearly_profit = calc_yearly_profit(
    yearly_income,
    monthly_debt_payment,
    yearly_expense
  )
  const gross_yield = calc_gross_yield(property_price, yearly_income)
  const real_yield = calc_real_yield(
    property_price,
    yearly_income,
    yearly_expense
  )
  const yield_after_repayment = calc_yield_after_repayment(
    property_price,
    yearly_profit
  )
  const ccr = calc_ccr(yearly_profit, cash)

  return {
    monthly_debt_payment: Math.round(monthly_debt_payment),
    yearly_expense: Math.round(yearly_expense),
    yearly_payment: Math.round(yearly_payment),
    yearly_profit: Math.round(yearly_profit),
    gross_yield,
    real_yield,
    yield_after_repayment,
    ccr,
  }
}
