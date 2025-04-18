"use client"

import type React from "react"

import { useState } from "react"
import { Row, Col, Card, Statistic, Table, Input, Spin, Alert, Typography } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from "@ant-design/icons"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Customer } from "../types"
import { useCustomers } from "../hooks/useCustomers"
import { getRiskLevel, getRiskColor } from "../utils/riskCalculator"
import type { ColumnsType } from "antd/es/table"


const { Title } = Typography
const { Search } = Input

const Dashboard: React.FC = () => {
  const { customers, loading, error, getRiskScoreDistribution, getIncomeExpensesData } = useCustomers()
  const [searchText, setSearchText] = useState("")

  // Filter customers based on search text
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Calculate total income, expenses, and average risk score
  const totalIncome = customers.reduce((sum, customer) => sum + customer.monthlyIncome, 0)
  const totalExpenses = customers.reduce((sum, customer) => sum + customer.monthlyExpenses, 0)
  const avgRiskScore =
    customers.length > 0
      ? Math.round(customers.reduce((sum, customer) => sum + (customer.riskScore || 0), 0) / customers.length)
      : 0

  // Prepare data for charts
  const riskDistribution = getRiskScoreDistribution()
  const incomeExpensesData = getIncomeExpensesData()

  // Table columns
  const columns: ColumnsType<Customer> = [
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
      sorter: (a, b) => a.customerId.localeCompare(b.customerId),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Monthly Income",
      dataIndex: "monthlyIncome",
      key: "monthlyIncome",
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.monthlyIncome - b.monthlyIncome,
    },
    {
      title: "Monthly Expenses",
      dataIndex: "monthlyExpenses",
      key: "monthlyExpenses",
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.monthlyExpenses - b.monthlyExpenses,
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "riskScore",
      render: (value: number) => {
        const riskLevel = getRiskLevel(value)
        return (
          <span style={{ color: getRiskColor(riskLevel) }}>
            {value} ({riskLevel})
          </span>
        )
      },
      sorter: (a, b) => (a.riskScore || 0) - (b.riskScore || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = ""
        switch (status) {
          case "Review":
            color = "#1677ff"
            break
          case "Approved":
            color = "#52c41a"
            break
          case "Rejected":
            color = "#ff4d4f"
            break
        }
        return <span style={{ color }}>{status}</span>
      },
      filters: [
        { text: "Review", value: "Review" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ]
  if (loading) {
    return <Spin size="large" />
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />
  }

  return (
    <div>
      <Title level={2}>Dashboard Overview</Title>

      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="dashboard-card stats-card">
            <Statistic
              title="Total Monthly Income"
              value={totalIncome}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="dashboard-card stats-card">
            <Statistic
              title="Total Monthly Expenses"
              value={totalExpenses}
              precision={0}
              valueStyle={{ color: "#cf1322" }}
              prefix="$"
              suffix=""
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="dashboard-card stats-card">
            <Statistic
              title="Average Risk Score"
              value={avgRiskScore}
              precision={0}
              valueStyle={{ color: getRiskColor(getRiskLevel(avgRiskScore)) }}
              suffix="/100"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="dashboard-card stats-card">
            <Statistic
              title="Profit Margin"
              value={((totalIncome - totalExpenses) / totalIncome) * 100}
              precision={2}
              valueStyle={{ color: totalIncome > totalExpenses ? "#3f8600" : "#cf1322" }}
              prefix={totalIncome > totalExpenses ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Income vs Expenses" className="dashboard-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={incomeExpensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#52c41a" activeDot={{ r: 8 }} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#ff4d4f" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Risk Score Distribution" className="dashboard-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="riskLevel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Number of Customers" fill="#1677ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Customer Table */}
      <Card
        title="Customer Data"
        className="dashboard-card"
        style={{ marginTop: "24px" }}
        extra={
          <Search
            placeholder="Search customers"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="customerId"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  )
}

export default Dashboard
