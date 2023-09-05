import { assert } from "./utils"

// property price = land price + building price
// TODO: property price + expenses = land book value + building book value + equipment book value?

interface CalcBookValueParams {
  property_price: number
  land_price: number
  building_price: number
  expenses: number
}

export function calc_book_values(args: CalcBookValueParams): {
  land: number
  building: number
} {
  const property_price = args["property_price"]
  const land_price = args["land_price"]
  const building_price = args["building_price"]
  assert(
    land_price + building_price == property_price,
    "land + building price != property price",
  )
  const expenses = args["expenses"]

  const land_ratio = land_price / property_price
  const land_expenses = land_ratio * expenses
  // TODO: estimate building book value at 70 ~ 80% of building cost
  const building_expenses = expenses - land_expenses
  // TODO: include expenses only included in building

  return {
    land: land_price + land_expenses,
    building: building_price + building_expenses,
  }
}
