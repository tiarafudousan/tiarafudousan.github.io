import { assert } from "./utils"
// 仲介手数料 - brokerage fee

export function calc_brokerage_fee(
  rate: number,
  property_price: number,
  building_sales_tax: number,
): number {
  assert(0 < rate && rate < 1, "rate")
  assert(property_price > building_sales_tax, "price")
  return Math.floor((property_price - building_sales_tax) * rate) + 60_000
}
