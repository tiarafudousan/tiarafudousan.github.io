export interface Inputs<a> {
  property_price: a
  yearly_income: a
  vacancy_rate: a
  running_cost_rate: a
  cash: a
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
  loan?: string
  years?: string
  interest_rate?: string
}
