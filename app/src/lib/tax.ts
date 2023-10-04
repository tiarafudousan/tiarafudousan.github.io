import { assert } from "./utils"

// ### 不動産取得税 ###
export type RealEstateType = "land" | "building"
const ACQUISITION_TAX_RATES = { land: 0.015, building: 0.03 }
export type RegistrationType = "land" | "building"
const REGISTRATION_TAX_RATES = { land: 0.015, building: 0.02 }

/*
固定資産税課税標準額と固定資産税評価額は同じです。 
住宅用地などでは、固定資産税評価額より小さくなったり,
土地の固定資産税課税標準額は固定資産税評価額より小さくなるケースが多い
*/
export function calc_real_estate_acquisition_tax(
  real_estate_type: RealEstateType,
  // 固定資産税評価額
  property_tax_eval: number,
): number {
  return Math.floor(property_tax_eval * ACQUISITION_TAX_RATES[real_estate_type])
}

// 所有権移転登録免許税
export function calc_registration_license_tax(
  registeration_type: RegistrationType,
  property_tax_eval: number,
): number {
  return Math.floor(
    property_tax_eval * REGISTRATION_TAX_RATES[registeration_type],
  )
}

// 固定資産税 - estimate
export function calc_property_tax(property_tax_base: number): number {
  // property_tax_base = 固定資産税 課税標準額
  return property_tax_base * 0.014
}

// 都市計画税 - estimate
export function calc_city_planning_tax(property_tax_base: number): number {
  // property_tax_base = 都市計画税 課税標準額
  return property_tax_base * 0.003
}

// 印紙税 //
export type ContractType = "bank" | "real_estate"

const STAMP_TAXES = [
  // value under contract, bank tax, real estate tax
  [9999, 0, 0],
  [100_000, 200, 0],
  [500_000, 400, 200],
  [1_000_000, 1_000, 500],
  [5_000_000, 2_000, 1_000],
  [10_000_000, 10_000, 5_000],
  [50_000_000, 20_000, 10_000],
  [100_000_000, 60_000, 30_000],
  [500_000_000, 100_000, 60_000],
  [1_000_000_000, 200_000, 160_000],
  [5_000_000_000, 400_000, 320_000],
  [Infinity, 600_000, 480_000],
]

export function calc_stamp_tax(
  contract_type: ContractType,
  value: number,
): number {
  const i = contract_type == "bank" ? 1 : 2

  for (let j = 0; j < STAMP_TAXES.length; j++) {
    if (value <= STAMP_TAXES[j][0]) {
      return STAMP_TAXES[j][i]
    }
  }

  return STAMP_TAXES[-1][i]
}

// 抵当権 - mortgage //
// 抵当権設定のための登録免許税
export function calc_mortgage_registration_tax(mortgage_value: number): number {
  return Math.floor(mortgage_value * 0.004)
}

// // ### 法人税 ###
// function calc_corporate_tax(income):
//     i = income
//     tax = 0

//     bracket = min(income, 8_000_000)
//     tax += bracket * 0.15
//     i -= bracket

//     tax += i * 0.234

//     return tax

// BASE_RESIDENT_TAX = 70_000

// function calc_resident_tax(income):
//     tax_base = calc_corporate_tax(income)
//     tax = BASE_RESIDENT_TAX

//     if tax_base < 10_000_000:
//         tax += tax_base * 0.097
//     else:
//         tax += tax_base * 0.119

//     return tax

// // TODO: more accurate estimate
// function estimate_corporate_tax(income):
//     return income * 0.23 + BASE_RESIDENT_TAX
