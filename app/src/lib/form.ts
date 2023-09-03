export interface Inputs<a> {
  property_price: a
  gpi: a
  delta_gpi: a
  vacancy_rate: a
  operating_cost_rate: a
  cash: a
  purchase_cost: a
  loan: a
  years: a
  interest_rate: a
}

export interface Errors {
  property_price?: string
  gpi?: string
  delta_gpi?: string
  vacancy_rate?: string
  operating_cost_rate?: string
  cash?: string
  purchase_cost?: string
  years?: string
  interest_rate?: string
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
    gpi: 0,
    delta_gpi: 0,
    vacancy_rate: 0,
    operating_cost_rate: 0,
    cash: 0,
    purchase_cost: 0,
    loan: 0,
    years: 0,
    interest_rate: 0,
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
    const [error, value] = validateNum(
      inputs.operating_cost_rate,
      false,
      0,
      100,
    )
    if (error) {
      errors.operating_cost_rate = error
    } else {
      values.operating_cost_rate = value
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

  if (!errors.property_price && !errors.cash && !errors.purchase_cost) {
    const loan = calcLoan(inputs)
    if (loan != null) {
      values.loan = loan
      if (values.loan < 0) {
        errors.cash = "自己資金 > 物件価格 + 購入時諸費用"
      }
    }
  }

  // if loan > 0 then years > 0
  if (values.loan > 0 && values.years == 0) {
    errors.years = "借入金額 > 0, 0より大きい数字を入力してください"
  }

  return [Object.keys(errors).length > 0 ? errors : null, values]
}

export function calcLoan(args: {
  property_price: string
  purchase_cost: string
  cash: string
}): number | null {
  const property_price = parseInt(args.property_price)
  const purchase_cost = parseInt(args.purchase_cost)
  const cash = parseInt(args.cash)

  const loan = property_price + purchase_cost - cash

  return isNaN(loan) ? null : loan
}
