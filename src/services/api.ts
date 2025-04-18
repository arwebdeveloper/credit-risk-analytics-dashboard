import axios from "axios"
import type { Customer } from "../types"

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Get all customers
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get("/customers")
    return response.data
  } catch (error) {
    console.error("Error fetching customers:", error)
    throw error
  }
}

// Update customer status
export const updateCustomerStatus = async (
  customerId: string,
  status: "Review" | "Approved" | "Rejected",
): Promise<Customer> => {
  try {
    const response = await api.patch(`/customers/${customerId}`, { status })
    return response.data
  } catch (error) {
    console.error("Error updating customer status:", error)
    throw error
  }
}

// Create alert for high-risk customer
export const createAlert = async (customerId: string, riskScore: number): Promise<void> => {
  try {
    await api.post("/alerts", { customerId, riskScore })
  } catch (error) {
    console.error("Error creating alert:", error)
    throw error
  }
}

export default api
