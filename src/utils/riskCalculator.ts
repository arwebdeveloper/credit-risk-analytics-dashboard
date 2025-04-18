import type { Customer } from "../types"

// Calculate risk score based on credit score, loan repayment history, and loans vs income ratio
export const calculateRiskScore = (customer: Customer): number => {
  // Credit score component (0-40 points)
  // Higher credit score = lower risk
  let creditScoreComponent = 0
  if (customer.creditScore >= 750) {
    creditScoreComponent = 40
  } else if (customer.creditScore >= 700) {
    creditScoreComponent = 35
  } else if (customer.creditScore >= 650) {
    creditScoreComponent = 25
  } else if (customer.creditScore >= 600) {
    creditScoreComponent = 15
  } else {
    creditScoreComponent = 5
  }

  // Loan repayment history component (0-30 points)
  // Calculate percentage of successful payments
  const repaymentHistory = customer.loanRepaymentHistory
  const successfulPayments = repaymentHistory.filter((payment) => payment === 1).length
  const repaymentRate = successfulPayments / repaymentHistory.length
  const repaymentComponent = Math.round(repaymentRate * 30)

  // Loans to income ratio component (0-30 points)
  // Lower ratio = lower risk
  const loansToIncomeRatio = customer.outstandingLoans / (customer.monthlyIncome * 12)
  let ratioComponent = 0
  if (loansToIncomeRatio <= 0.2) {
    ratioComponent = 30
  } else if (loansToIncomeRatio <= 0.4) {
    ratioComponent = 25
  } else if (loansToIncomeRatio <= 0.6) {
    ratioComponent = 15
  } else if (loansToIncomeRatio <= 0.8) {
    ratioComponent = 10
  } else {
    ratioComponent = 0
  }

  // Calculate total risk score (0-100)
  // Higher score = higher risk
  const safetyScore = creditScoreComponent + repaymentComponent + ratioComponent
  const riskScore = 100 - safetyScore

  return riskScore
}

// Get risk level based on risk score
export const getRiskLevel = (riskScore: number): "Low" | "Medium" | "High" => {
  if (riskScore < 30) {
    return "Low"
  } else if (riskScore < 60) {
    return "Medium"
  } else {
    return "High"
  }
}

// Get color based on risk level
export const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case "Low":
      return "#52c41a" // green
    case "Medium":
      return "#faad14" // yellow
    case "High":
      return "#ff4d4f" // red
    default:
      return "#1677ff" // blue
  }
}
