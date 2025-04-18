export interface Customer {
  customerId: string
  name: string
  monthlyIncome: number
  monthlyExpenses: number
  creditScore: number
  outstandingLoans: number
  loanRepaymentHistory: number[]
  accountBalance: number
  status: "Review" | "Approved" | "Rejected"
  riskScore?: number
}

export interface RiskScoreDistribution {
  riskLevel: string
  count: number
}

export interface IncomeExpenseData {
  month: string
  income: number
  expenses: number
}
