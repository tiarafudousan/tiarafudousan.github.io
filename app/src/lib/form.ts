export interface Inputs<a> {
    property_price: a
    yearly_income: a
    vacancy_rate: a
    running_cost_rate: a
    cash: a
    purchase_cost: a
    loan: a
    years: a
    interest_rate: a
}

export interface Errors {
    property_price?: string
    yearly_income?: string
    vacancy_rate?: string
    running_cost_rate?: string
    cash?: string
    purchase_cost?: string
    years?: string
    interest_rate?: string
}

function validateNum(
    input: string,
    int: boolean = true,
    min = 0,
    max = Infinity
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
    inputs: Inputs<string>
): [errors: Errors | null, values: Inputs<number>] {
    const values: Inputs<number> = {
        property_price: 0,
        yearly_income: 0,
        vacancy_rate: 0,
        running_cost_rate: 0,
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
        const [error, value] = validateNum(inputs.yearly_income)
        if (error) {
            errors.yearly_income = error
        } else {
            values.yearly_income = value
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
            inputs.running_cost_rate,
            false,
            0,
            100
        )
        if (error) {
            errors.running_cost_rate = error
        } else {
            values.running_cost_rate = value
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
        const loan = calculateLoan(inputs)
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

export function calculateLoan(args: {
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
