import { Inputs } from "./form"
import { sum } from "./utils"
import { FixedRateLoan } from "./loan"
import * as building_lib from "./building"
import { BuildingType } from "./building"
import * as accounting_lib from "./accounting"
import * as tax_lib from "./tax"
import * as agent_lib from "./agent"

export interface InitialCost {
  building_sales_tax: number
  stamp_tax_real_estate: number
  stamp_tax_bank: number
  mortgage_registration_tax: number
  registration_license_tax_land: number
  registration_license_tax_building: number
  judicial_scrivener_fee: number
  brokerage_fee: number
  brokerage_fee_land: number
  brokerage_fee_building: number
  real_estate_acquisition_tax_land: number
  real_estate_acquisition_tax_building: number
  purchase_misc_fee: number
  total: number
}

export function calc_initial_cost(inputs: Inputs<number>): InitialCost {
  // 消費税
  const building_sales_tax = tax_lib.calc_sales_tax(inputs.building_price)

  // 印紙代 - 売買契約
  const stamp_tax_real_estate = tax_lib.calc_stamp_tax(
    "real_estate",
    inputs.property_price,
  )
  // 印紙代 - 銀行金消契約
  const stamp_tax_bank = tax_lib.calc_stamp_tax("bank", inputs.principal)
  // 抵当権設定費
  const mortgage_registration_tax = tax_lib.calc_mortgage_registration_tax(
    inputs.principal,
  )
  // 所有権移転登録免許税
  const registration_license_tax_land = tax_lib.calc_registration_license_tax(
    "land",
    inputs.property_tax_eval_land,
  )
  const registration_license_tax_building =
    tax_lib.calc_registration_license_tax(
      "building",
      inputs.property_tax_eval_building,
    )
  // 司法書士費
  inputs.judicial_scrivener_fee
  // 仲介手数料率 (税込)
  // TODO: sales tax
  const sales_tax = 0
  const brokerage_fee = agent_lib.calc_brokerage_fee(
    inputs.brokerage_fee_rate / 100,
    inputs.property_price,
    sales_tax,
  )
  const brokerage_fee_building = Math.floor(
    brokerage_fee * (inputs.building_price / inputs.property_price),
  )
  const brokerage_fee_land = brokerage_fee - brokerage_fee_building
  // 不動産取得税 土地
  const real_estate_acquisition_tax_land =
    tax_lib.calc_real_estate_acquisition_tax(
      "land",
      inputs.property_tax_eval_land,
    )
  // 不動産取得税 建物
  const real_estate_acquisition_tax_building =
    tax_lib.calc_real_estate_acquisition_tax(
      "building",
      inputs.property_tax_eval_building,
    )

  const total = sum(
    building_sales_tax,
    stamp_tax_real_estate,
    stamp_tax_bank,
    mortgage_registration_tax,
    registration_license_tax_land,
    registration_license_tax_building,
    inputs.judicial_scrivener_fee,
    brokerage_fee,
    real_estate_acquisition_tax_land,
    real_estate_acquisition_tax_building,
    inputs.purchase_misc_fee,
  )

  return {
    building_sales_tax,
    stamp_tax_real_estate,
    stamp_tax_bank,
    mortgage_registration_tax,
    registration_license_tax_land,
    registration_license_tax_building,
    judicial_scrivener_fee: inputs.judicial_scrivener_fee,
    brokerage_fee,
    brokerage_fee_land,
    brokerage_fee_building,
    real_estate_acquisition_tax_land,
    real_estate_acquisition_tax_building,
    purchase_misc_fee: inputs.purchase_misc_fee,
    total,
  }
}

export interface CashFlowData {
  total_invested: number
  total_debt_payment: number
  cash: number
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
  maintanence_fee: number
  restoration_fee: number
  ad_fee: number
  insurance_fee: number
  opex_misc_fee: number
  initial_cost: number
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
  cap_rate: number
  lb: number
  fcr: number
  ccr: number
  k: number
  ber: number
  dcr: number
}

// TODO: 修繕費（当期一括償却）
// TODO: 大規模修繕費(10年償却CAPEX)
// TODO: capex - 大規模修繕

// TODO: IRR, NPV, DCF
// BER - break even ratio
// DCR - debt coverage ratio
export function calc_cf(params: {
  inputs: Inputs<number>
  initial_cost: InitialCost
  loan_sim: FixedRateLoan
  delta_year: number
  is_small_scale_residential_land: boolean
  exclude_initial_opex: boolean
}): CashFlowData {
  const {
    inputs,
    initial_cost,
    loan_sim,
    delta_year,
    is_small_scale_residential_land,
    exclude_initial_opex,
  } = params

  const land_price = inputs.property_price - inputs.building_price
  const initial_cost_opex = initial_cost.total - initial_cost.brokerage_fee

  // GPI //
  const gpi = Math.floor(inputs.gpi)

  // EGI //
  const vacancy_rate = inputs.vacancy_rate / 100
  const egi = gpi * (1 - vacancy_rate)

  // Loan //
  // property price + initial cost = principal + cash
  const cash = Math.floor(
    inputs.property_price + initial_cost.total - inputs.principal,
  )
  const total_invested = inputs.property_price + initial_cost.total
  const total_debt_payment = loan_sim.total

  // OPEX //
  const property_tax_land = tax_lib.calc_property_tax(
    inputs.property_tax_base_land,
    { is_small_scale_residential_land },
  )
  const property_tax_building = tax_lib.calc_property_tax(
    inputs.property_tax_base_building,
  )
  const city_planning_tax_land = tax_lib.calc_city_planning_tax(
    inputs.property_tax_base_land,
    { is_small_scale_residential_land },
  )
  const city_planning_tax_building = tax_lib.calc_city_planning_tax(
    inputs.property_tax_base_building,
  )
  const property_tax = property_tax_land + property_tax_building
  const city_planning_tax = city_planning_tax_land + city_planning_tax_building
  const maintanence_fee = (egi * inputs.maintanence_fee_rate) / 100

  const opex = sum(
    property_tax,
    city_planning_tax,
    maintanence_fee,
    inputs.restoration_fee,
    inputs.ad_fee,
    inputs.insurance_fee,
    inputs.opex_misc_fee,
    delta_year == 0 && !exclude_initial_opex ? initial_cost_opex : 0,
  )
  const noi = egi - opex

  // TODO: carry loss from previous year
  const capex = 0
  const ncf = noi - capex

  // BTCF //
  const ads = loan_sim.debt_repayments[delta_year]
  const lb = loan_sim.unpaid_principals[delta_year]
  const btcf = ncf - ads

  // ATCF //
  const book_values = accounting_lib.calc_book_values({
    property_price: inputs.property_price,
    land_price,
    building_price: inputs.building_price,
    // TODO: expenses
    expenses: 0,
  })
  const building_depreciation_period = building_lib.calc_depreciation_period(
    inputs.building_type as BuildingType,
    inputs.building_age,
  )
  const building_depreciation =
    delta_year < building_depreciation_period
      ? (book_values.building + initial_cost.brokerage_fee_building) /
        building_depreciation_period
      : 0
  // TODO: equipment depreciation?
  const equipment_depreciation_period = 0
  const equipment_depreciation = 0
  const principal = loan_sim.principals[delta_year]
  const taxable_income =
    btcf - (building_depreciation + equipment_depreciation) + principal
  const tax_rate = inputs.tax_rate / 100
  // TODO: calc tax (residence, income, etc...)?
  const tax = Math.max(taxable_income * tax_rate, 0)
  const atcf = btcf - tax

  const gross_yield = gpi / inputs.property_price

  // if BTCF = NOI - ADS
  //    BTCF = (FCR - K) * LB + FCR * cash

  const cap_rate = noi / inputs.property_price
  const k = lb > 0 ? ads / lb : 0
  const fcr = cash + lb > 0 ? noi / (cash + lb) : 0
  const ccr = cash > 0 ? btcf / cash : 1
  const ber = gpi > 0 ? (opex + ads) / gpi : 0
  const dcr = ads > 0 ? noi / ads : 0

  return {
    total_invested,
    total_debt_payment,
    cash,
    gross_yield,
    gpi,
    egi,
    // opex
    property_tax_land,
    property_tax_building,
    city_planning_tax_land,
    city_planning_tax_building,
    property_tax,
    city_planning_tax,
    maintanence_fee,
    restoration_fee: inputs.restoration_fee,
    ad_fee: inputs.ad_fee,
    insurance_fee: inputs.insurance_fee,
    opex_misc_fee: inputs.opex_misc_fee,
    initial_cost: delta_year == 0 ? initial_cost_opex : 0,
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
    cap_rate,
    lb,
    fcr,
    ccr,
    k,
    ber,
    dcr,
  }
}

export function sim_cf(params: {
  inputs: Inputs<number>
  initial_cost: InitialCost
  loan_sim: FixedRateLoan
  years: number
  is_small_scale_residential_land: boolean
  exclude_initial_opex?: boolean
}): CashFlowData[] {
  const {
    inputs,
    initial_cost,
    loan_sim,
    years,
    is_small_scale_residential_land,
    exclude_initial_opex = false,
  } = params
  const cf_data: CashFlowData[] = []

  let gpi = inputs.gpi
  const delta_gpi = (-1 * inputs.delta_gpi) / 100
  for (let i = 0; i < years; i++) {
    const data = calc_cf({
      inputs: {
        ...inputs,
        gpi,
      },
      initial_cost,
      loan_sim,
      delta_year: i,
      is_small_scale_residential_land,
      exclude_initial_opex,
    })

    gpi = Math.max(gpi * (1 + delta_gpi), 0)

    cf_data.push(data)
  }

  return cf_data
}
