import { useState, useEffect } from "react"
import type { Customer, RiskScoreDistribution, IncomeExpenseData } from "../types"
import { getCustomers } from "../services/api"
import { calculateRiskScore, getRiskLevel } from "../utils/riskCalculator"

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const data = await getCustomers()

        // Calculate risk score for each customer
        const customersWithRiskScore = data.map((customer) => ({
          ...customer,
          riskScore: calculateRiskScore(customer),
        }))

        setCustomers(customersWithRiskScore)
        setError(null)
      } catch (err) {
        setError("Failed to fetch customers data")
        console.error(err)

        // Use sample data if API fails
        const sampleData = [
          {
            customerId: "CUST1001",
            name: "Alice Johnson",
            monthlyIncome: 6200,
            monthlyExpenses: 3500,
            creditScore: 710,
            outstandingLoans: 15000,
            loanRepaymentHistory: [1, 0, 1, 1, 1, 1, 0, 1],
            accountBalance: 12500,
            status: "Review",
          },
          {
            customerId: "CUST1002",
            name: "Bob Smith",
            monthlyIncome: 4800,
            monthlyExpenses: 2800,
            creditScore: 640,
            outstandingLoans: 20000,
            loanRepaymentHistory: [1, 1, 1, 0, 0, 1, 0, 0],
            accountBalance: 7300,
            status: "Approved",
          },
        ] as Customer[]

        const sampleWithRiskScore = sampleData.map((customer) => ({
          ...customer,
          riskScore: calculateRiskScore(customer),
        }))

        setCustomers(sampleWithRiskScore)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Generate risk score distribution data
  const getRiskScoreDistribution = (): RiskScoreDistribution[] => {
    const distribution: { [key: string]: number } = {
      "Low Risk": 0,
      "Medium Risk": 0,
      "High Risk": 0,
    }

    customers.forEach((customer) => {
      if (!customer.riskScore) return

      const riskLevel = getRiskLevel(customer.riskScore)
      switch (riskLevel) {
        case "Low":
          distribution["Low Risk"]++
          break
        case "Medium":
          distribution["Medium Risk"]++
          break
        case "High":
          distribution["High Risk"]++
          break
      }
    })

    return Object.entries(distribution).map(([riskLevel, count]) => ({
      riskLevel,
      count,
    }))
  }

  // Generate income vs expenses data
  const getIncomeExpensesData = (): IncomeExpenseData[] => {
    // For demo purposes, generate 6 months of data based on current customers
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

    return months.map((month, index) => {
      // Calculate average income and expenses with some random variation
      const avgIncome =
        customers.reduce((sum, customer) => sum + customer.monthlyIncome, 0) / Math.max(customers.length, 1)
      const avgExpenses =
        customers.reduce((sum, customer) => sum + customer.monthlyExpenses, 0) / Math.max(customers.length, 1)

      // Add some variation for each month
      const variationFactor = 0.9 + Math.random() * 0.2 // 0.9 to 1.1

      return {
        month,
        income: Math.round(avgIncome * variationFactor * (1 + index * 0.02)),
        expenses: Math.round(avgExpenses * variationFactor * (1 + index * 0.01)),
      }
    })
  }

  return {
    customers,
    setCustomers,
    loading,
    error,
    getRiskScoreDistribution,
    getIncomeExpensesData,
  }
}
