import { Inputs } from "./form"

// 毎月返済額の計算 - 元利均等返済
function calc_monthly_debt_payment(p: number, r: number, n: number) {
    return (p * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}

export interface SimData {
    total_cash_in: number
    total_debt_payment: number
    monthly_debt_payment: number
    monthly_repayment_ratio: number
    // Monthly cash in before debt payment
    monthly_cash_in: number
    yearly_expense: number
    yearly_cash_out: number
    yearly_cash_flow: number
    // 表面利回り
    gross_yield: number
    // 実質利回り
    real_yield: number
    ccr: number
    // Net operating income (excludes loan and taxes)
    noi: number
}

export function simulate(inputs: Inputs<number>): SimData {
    // Yearly rent at 100% occupancy
    const yearly_rent = Math.floor(inputs.yearly_rent)
    const vacancy_rate = inputs.vacancy_rate / 100
    const operating_cost_rate = inputs.operating_cost_rate / 100

    const cash = Math.floor(inputs.cash)
    const loan = Math.floor(inputs.loan)
    const n = inputs.years * 12
    const interest_rate = inputs.interest_rate / (100 * 12)

    // Cash in
    const yearly_cash_in = yearly_rent * (1 - vacancy_rate)
    const monthly_cash_in = yearly_cash_in / 12

    // property_price + cost = cash +  loan
    const total_cash_in = cash + loan

    // Loan
    const monthly_debt_payment =
        n > 0 ? calc_monthly_debt_payment(loan, interest_rate, n) : 0
    const monthly_repayment_ratio =
        monthly_cash_in > 0 ? monthly_debt_payment / monthly_cash_in : 1
    const total_debt_payment = n * monthly_debt_payment

    // Cash flow
    const yearly_expense = yearly_rent * operating_cost_rate
    const yearly_cash_out = monthly_debt_payment * 12 + yearly_expense
    const yearly_cash_flow = yearly_cash_in - yearly_cash_out

    // Yield
    const gross_yield = yearly_rent / total_cash_in
    const real_yield = yearly_cash_flow / total_cash_in
    const ccr = cash > 0 ? yearly_cash_flow / cash : 1
    const noi = (yearly_cash_in - yearly_expense) / total_cash_in

    return {
        total_cash_in,
        total_debt_payment,
        monthly_debt_payment,
        monthly_repayment_ratio,
        monthly_cash_in,
        yearly_expense,
        yearly_cash_out,
        yearly_cash_flow,
        gross_yield,
        real_yield,
        ccr,
        noi,
    }
}
