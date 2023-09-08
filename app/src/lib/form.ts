export interface Inputs<a> {
  property_price: a
  land_price: a
  building_type: string
  building_age: a
  gpi: a
  delta_gpi: a
  vacancy_rate: a
  opex_rate: a
  cash: a
  purchase_cost: a
  principal: a
  years: a
  interest_rate: a
  tax_rate: a
}

export interface Errors {
  property_price?: string
  land_price?: string
  bulding_type?: string
  building_age?: string
  gpi?: string
  delta_gpi?: string
  vacancy_rate?: string
  opex_rate?: string
  cash?: string
  purchase_cost?: string
  years?: string
  interest_rate?: string
  tax_rate?: string
}

function validateNum(
  input: string,
  int: boolean = true,
  min = 0,
  max = Infinity,
): [error: string | null, value: number] {
  let error = null
  const value = int ? parseInt(input) : parseFloat(input)

  if (isNaN(value)) {
    error = "数字を入力してください"
  } else if (value < min) {
    error = `${min}より大きい数字を入力してください`
  } else if (value > max) {
    error = `${max}より小さい数字を入力してください`
  }

  return [error, value]
}

export function validate(
  inputs: Inputs<string>,
): [errors: Errors | null, values: Inputs<number>] {
  const values: Inputs<number> = {
    property_price: 0,
    land_price: 0,
    building_type: "RC",
    building_age: 0,
    gpi: 0,
    delta_gpi: 0,
    vacancy_rate: 0,
    opex_rate: 0,
    cash: 0,
    purchase_cost: 0,
    principal: 0,
    years: 0,
    interest_rate: 0,
    tax_rate: 0,
  }
  const errors: Errors = {}

  {
    const [error, value] = validateNum(inputs.property_price)
    if (error) {
      errors.property_price = error
    } else {
      values.property_price = value
    }
  }
  {
    const [error, value] = validateNum(inputs.land_price)
    if (error) {
      errors.land_price = error
    } else {
      values.land_price = value
    }
  }

  values.building_type = inputs.building_type

  {
    const [error, value] = validateNum(inputs.building_age, true, 0, 100)
    if (error) {
      errors.building_age = error
    } else {
      values.building_age = value
    }
  }
  {
    const [error, value] = validateNum(inputs.gpi)
    if (error) {
      errors.gpi = error
    } else {
      values.gpi = value
    }
  }
  {
    const [error, value] = validateNum(inputs.delta_gpi, false, -100, 100)
    if (error) {
      errors.delta_gpi = error
    } else {
      values.delta_gpi = value
    }
  }
  {
    const [error, value] = validateNum(inputs.vacancy_rate, false, 0, 100)
    if (error) {
      errors.vacancy_rate = error
    } else {
      values.vacancy_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.opex_rate, false, 0, 100)
    if (error) {
      errors.opex_rate = error
    } else {
      values.opex_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.cash)
    if (error) {
      errors.cash = error
    } else {
      values.cash = value
    }
  }
  {
    const [error, value] = validateNum(inputs.purchase_cost)
    if (error) {
      errors.purchase_cost = error
    } else {
      values.purchase_cost = value
    }
  }
  {
    const [error, value] = validateNum(inputs.years)
    if (error) {
      errors.years = error
    } else {
      values.years = value
    }
  }
  {
    const [error, value] = validateNum(inputs.interest_rate, false, 0)
    if (error) {
      errors.interest_rate = error
    } else {
      values.interest_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.tax_rate, false, 0)
    if (error) {
      errors.tax_rate = error
    } else {
      values.tax_rate = value
    }
  }

  if (!errors.property_price && !errors.cash && !errors.purchase_cost) {
    const principal = calcPrincipal(inputs)
    if (principal != null) {
      values.principal = principal
      if (values.principal < 0) {
        errors.cash = "自己資金 > 物件価格 + 購入時諸費用"
      }
    }
  }

  if (values.land_price > values.property_price) {
    errors.land_price = "土地価格 > 物件価格"
  }

  // if principal > 0 then years > 0
  if (values.principal > 0 && values.years == 0) {
    errors.years = "借入金額 > 0, 0より大きい数字を入力してください"
  }

  return [Object.keys(errors).length > 0 ? errors : null, values]
}

export function calcPrincipal(args: {
  property_price: string
  purchase_cost: string
  cash: string
}): number | null {
  const property_price = parseInt(args.property_price)
  const purchase_cost = parseInt(args.purchase_cost)
  const cash = parseInt(args.cash)

  const principal = property_price + purchase_cost - cash

  return isNaN(principal) ? null : principal
}
