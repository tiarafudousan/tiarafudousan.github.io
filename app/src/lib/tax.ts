import { assert } from "./utils"

// ### 不動産取得税 ###
export type RealEstateType = "land" | "building"
const ACQUISITION_TAX_RATES = { land: 0.015, building: 0.03 }
export type RegistrationType = "land" | "building"
const REGISTRATION_TAX_RATES = { land: 0.015, building: 0.02 }

export function calc_real_estate_acquisition_tax(
  real_estate_type: RealEstateType,
  property_tax_value: number,
): number {
  return Math.floor(
    property_tax_value * ACQUISITION_TAX_RATES[real_estate_type],
  )
}

// 所有権移転登録免許税
export function calc_registration_license_tax(
  registeration_type: RegistrationType,
  property_tax_value: number,
): number {
  return Math.floor(
    property_tax_value * REGISTRATION_TAX_RATES[registeration_type],
  )
}

// 固定資産税 - estimate
export function calc_property_tax(tax_base: number): number {
  // tax_base = 固定資産税 課税標準額
  return tax_base * 0.014
}

// 都市計画税 - estimate
export function calc_city_planning_tax(tax_base: number): number {
  // tax_base = 都市計画税 課税標準額
  return tax_base * 0.003
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
