import { Inputs } from "./form"
import { sum } from "./utils"
import { FixedRateLoan } from "./loan"
import * as building_lib from "./building"
import { BuildingType } from "./building"
import * as accounting_lib from "./accounting"
import * as tax_lib from "./tax"

export interface CashFlowData {
  total_invested: number
  total_debt_payment: number
  // 表面利回り
  gross_yield: number
  gpi: number
  egi: number
  property_tax_land: number
  property_tax_building: number
  city_planning_tax_land: number
  city_planning_tax_building: number
  property_tax: number
  city_planning_tax: number
  opex: number
  noi: number
  capex: number
  ncf: number
  ads: number
  btcf: number
  building_depreciation_period: number
  building_depreciation: number
  equipment_depreciation_period: number
  equipment_depreciation: number
  principal: number
  taxable_income: number
  tax: number
  atcf: number
  lb: number
  fcr: number
  ccr: number
  k: number
}

// TODO: initial purchase cost
// TODO: capex - 大規模修繕
// TODO: BER, DCR, IRR?
export function calc_cf(params: {
  inputs: Inputs<number>
  loan_sim: FixedRateLoan
  delta_year: number
}): CashFlowData {
  const { inputs, loan_sim, delta_year } = params

  const building_price = inputs.property_price - inputs.land_price

  // GPI //
  const gpi = Math.floor(inputs.gpi)
  const vacancy_rate = inputs.vacancy_rate / 100
  const tax_rate = inputs.tax_rate / 100

  // EGI //
  const egi = gpi * (1 - vacancy_rate)

  // Loan //
  const cash = Math.floor(inputs.cash)
  const p = Math.floor(inputs.principal)

  // property_price + cost = cash + principal
  const total_invested = cash + p
  const total_debt_payment = loan_sim.total

  // OPEX //
  const property_tax_land = tax_lib.calc_property_tax(
    inputs.property_tax_base_land,
  )
  const property_tax_building = tax_lib.calc_property_tax(
    inputs.property_tax_base_building,
  )
  const city_planning_tax_land = tax_lib.calc_city_planning_tax(
    inputs.property_tax_base_land,
  )
  const city_planning_tax_building = tax_lib.calc_city_planning_tax(
    inputs.property_tax_base_building,
  )
  const property_tax = property_tax_land + property_tax_building
  const city_planning_tax = city_planning_tax_land + city_planning_tax_building

  const opex = sum(
    property_tax,
    city_planning_tax,
    inputs.maintanence_fee,
    inputs.restoration_fee,
    inputs.ad_fee,
    inputs.insurance_fee,
    inputs.opex_misc_fee,
  )
  const noi = egi - opex

  // TODO: capex
  const capex = 0
  const ncf = noi - capex

  // BTCF //
  const ads = loan_sim.debt_repayments[delta_year]
  const lb = p
  const btcf = ncf - ads

  // ATCF //
  const book_values = accounting_lib.calc_book_values({
    property_price: inputs.property_price,
    land_price: inputs.land_price,
    building_price,
    // TODO: expenses
    expenses: 0,
  })
  const building_depreciation_period = building_lib.calc_depreciation_period(
    inputs.building_type as BuildingType,
    inputs.building_age,
  )
  const building_depreciation =
    delta_year < building_depreciation_period
      ? book_values.building / building_depreciation_period
      : 0
  // TODO: equipment depreciation
  const equipment_depreciation_period = 0
  const equipment_depreciation = 0
  const principal = loan_sim.principals[delta_year]
  const taxable_income =
    btcf - (building_depreciation + equipment_depreciation) + principal
  // TODO: tax
  const tax = Math.max(taxable_income * tax_rate, 0)
  const atcf = btcf - tax

  const gross_yield = gpi / inputs.property_price

  const fcr = noi / total_invested
  const ccr = cash > 0 ? btcf / cash : 1
  const k = lb > 0 ? ads / lb : 0

  return {
    total_invested,
    total_debt_payment,
    gross_yield,
    gpi,
    egi,
    property_tax_land,
    property_tax_building,
    city_planning_tax_land,
    city_planning_tax_building,
    property_tax,
    city_planning_tax,
    opex,
    noi,
    capex,
    ncf,
    ads,
    btcf,
    building_depreciation_period,
    building_depreciation,
    equipment_depreciation_period,
    equipment_depreciation,
    principal,
    taxable_income,
    tax,
    atcf,
    lb,
    fcr,
    ccr,
    k,
  }
}

export function sim_cf(params: {
  inputs: Inputs<number>
  loan_sim: FixedRateLoan
  years: number
}): CashFlowData[] {
  const { inputs, loan_sim, years } = params
  const cf_data: CashFlowData[] = []

  let gpi = inputs.gpi
  const delta_gpi = (-1 * inputs.delta_gpi) / 100
  for (let i = 0; i < years; i++) {
    const data = calc_cf({
      inputs: {
        ...inputs,
        gpi,
      },
      loan_sim,
      delta_year: i,
    })

    gpi = Math.max(gpi * (1 + delta_gpi), 0)

    cf_data.push(data)
  }

  return cf_data
}
