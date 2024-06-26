export interface LargeScaleRepairInput<a> {
  cost: a
  year: a
}

export interface Inputs<a> {
  // building //
  property_price: a
  building_price: a
  building_type: string
  building_age: a
  gpi: a
  delta_gpi: a
  vacancy_rate: a
  // purchase fee //
  property_tax_eval_land: a
  property_tax_eval_building: a
  judicial_scrivener_fee: a
  brokerage_fee_rate: a
  purchase_misc_fee: a
  // opex //
  property_tax_base_land: a
  property_tax_base_building: a
  maintanence_fee_rate: a
  restoration_fee: a
  ad_fee: a
  insurance_fee: a
  opex_misc_fee: a
  // loan //
  principal: a
  years: a
  interest_rate: a
  // tax //
  tax_rate: a
  large_scale_repairs: LargeScaleRepairInput<a>[]
}

export interface Errors {
  // building //
  property_price?: string
  building_price?: string
  bulding_type?: string
  building_age?: string
  gpi?: string
  delta_gpi?: string
  vacancy_rate?: string
  // purchase fee //
  property_tax_eval_land?: string
  property_tax_eval_building?: string
  judicial_scrivener_fee?: string
  brokerage_fee_rate?: string
  purchase_misc_fee?: string
  // opex //
  property_tax_base_land?: string
  property_tax_base_building?: string
  maintanence_fee_rate?: string
  restoration_fee?: string
  ad_fee?: string
  insurance_fee?: string
  opex_misc_fee?: string
  // loan //
  principal?: string
  years?: string
  interest_rate?: string
  // tax //
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
    // building //
    property_price: 0,
    building_price: 0,
    building_type: "RC",
    building_age: 0,
    gpi: 0,
    delta_gpi: 0,
    vacancy_rate: 0,
    // purchase fee //
    property_tax_eval_land: 0,
    property_tax_eval_building: 0,
    judicial_scrivener_fee: 0,
    brokerage_fee_rate: 0,
    purchase_misc_fee: 0,
    // opex //
    property_tax_base_land: 0,
    property_tax_base_building: 0,
    maintanence_fee_rate: 0,
    restoration_fee: 0,
    ad_fee: 0,
    insurance_fee: 0,
    opex_misc_fee: 0,
    // loan //
    principal: 0,
    years: 0,
    interest_rate: 0,
    // tax //
    tax_rate: 0,
    large_scale_repairs: [],
  }
  const errors: Errors = {}

  {
    const [error, value] = validateNum(inputs.property_price, true, 0)
    if (error) {
      errors.property_price = error
    } else {
      values.property_price = value
    }
  }
  {
    const [error, value] = validateNum(inputs.building_price, true, 0)
    if (error) {
      errors.building_price = error
    } else {
      values.building_price = value
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
    const [error, value] = validateNum(inputs.gpi, true, 0)
    if (error) {
      errors.gpi = error
    } else {
      values.gpi = value
    }
  }
  {
    const [error, value] = validateNum(inputs.delta_gpi, false, 0, 100)
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
    const [error, value] = validateNum(inputs.property_tax_eval_land, true, 0)
    if (error) {
      errors.property_tax_eval_land = error
    } else {
      values.property_tax_eval_land = value
    }
  }
  {
    const [error, value] = validateNum(
      inputs.property_tax_eval_building,
      true,
      0,
    )
    if (error) {
      errors.property_tax_eval_building = error
    } else {
      values.property_tax_eval_building = value
    }
  }
  {
    const [error, value] = validateNum(inputs.judicial_scrivener_fee, true, 0)
    if (error) {
      errors.judicial_scrivener_fee = error
    } else {
      values.judicial_scrivener_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.brokerage_fee_rate, false, 0, 100)
    if (error) {
      errors.brokerage_fee_rate = error
    } else {
      values.brokerage_fee_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.purchase_misc_fee, true, 0)
    if (error) {
      errors.purchase_misc_fee = error
    } else {
      values.purchase_misc_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.property_tax_base_land, true, 0)
    if (error) {
      errors.property_tax_base_land = error
    } else {
      values.property_tax_base_land = value
    }
  }
  {
    const [error, value] = validateNum(
      inputs.property_tax_base_building,
      true,
      0,
    )
    if (error) {
      errors.property_tax_base_building = error
    } else {
      values.property_tax_base_building = value
    }
  }
  {
    const [error, value] = validateNum(
      inputs.maintanence_fee_rate,
      false,
      0,
      100,
    )
    if (error) {
      errors.maintanence_fee_rate = error
    } else {
      values.maintanence_fee_rate = value
    }
  }
  {
    const [error, value] = validateNum(inputs.restoration_fee, true, 0)
    if (error) {
      errors.restoration_fee = error
    } else {
      values.restoration_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.ad_fee, true, 0)
    if (error) {
      errors.ad_fee = error
    } else {
      values.ad_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.insurance_fee, true, 0)
    if (error) {
      errors.insurance_fee = error
    } else {
      values.insurance_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.opex_misc_fee, true, 0)
    if (error) {
      errors.opex_misc_fee = error
    } else {
      values.opex_misc_fee = value
    }
  }
  {
    const [error, value] = validateNum(inputs.principal, true, 0)
    if (error) {
      errors.principal = error
    } else {
      values.principal = value
    }
  }
  {
    const [error, value] = validateNum(inputs.years, true, 0)
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

  if (values.building_price > values.property_price) {
    errors.building_price = "建物価格 > 物件価格"
  }

  // if principal > 0 then years > 0
  if (values.principal > 0 && values.years == 0) {
    errors.years = "借入金額 > 0, 0より大きい数字を入力してください"
  }

  return [Object.keys(errors).length > 0 ? errors : null, values]
}
