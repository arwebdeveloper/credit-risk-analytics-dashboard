"use client"

import type React from "react"

import { useState } from "react"
import { Card, Table, Progress, Tag, Input, Select, Row, Col, Typography, Spin, Alert } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import type { Customer } from "../types"
import { useCustomers } from "../hooks/useCustomers"
import { getRiskLevel, getRiskColor } from "../utils/riskCalculator"
import { ColumnsType } from "antd/es/table"

const { Title, Paragraph } = Typography
const { Search } = Input
const { Option } = Select

const RiskAssessment: React.FC = () => {
  const { customers, loading, error } = useCustomers()
  const [searchText, setSearchText] = useState("")
  const [riskFilter, setRiskFilter] = useState<string | null>(null)

  // Filter customers based on search text and risk level
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchText.toLowerCase())

    if (!riskFilter) return matchesSearch

    const customerRiskLevel = getRiskLevel(customer.riskScore || 0)
    return matchesSearch && customerRiskLevel.toLowerCase() === riskFilter.toLowerCase()
  })

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
      title: "Credit Score",
      dataIndex: "creditScore",
      key: "creditScore",
      sorter: (a, b) => a.creditScore - b.creditScore,
    },
    {
      title: "Loan Repayment History",
      dataIndex: "loanRepaymentHistory",
      key: "loanRepaymentHistory",
      render: (history: number[]) => (
        <div>
          {history.map((payment, index) => (
            <Tag key={index} color={payment === 1 ? "success" : "error"} style={{ marginBottom: "4px" }}>
              {payment === 1 ? "Paid" : "Missed"}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Loans/Income Ratio",
      key: "loansIncomeRatio",
      render: (_, record) => {
        const ratio = record.outstandingLoans / (record.monthlyIncome * 12)
        return (ratio * 100).toFixed(2) + "%"
      },
      sorter: (a, b) =>
        a.outstandingLoans / (a.monthlyIncome * 12) - b.outstandingLoans / (b.monthlyIncome * 12),
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "riskScore",
      render: (value: number) => {
        const riskLevel = getRiskLevel(value)
        const color = getRiskColor(riskLevel)

        return (
          <div>
            <Progress
              percent={value}
              size="small"
              status={riskLevel === "High" ? "exception" : "active"}
              strokeColor={color}
            />
            <Tag color={color}>{riskLevel} Risk</Tag>
          </div>
        )
      },
      sorter: (a, b) => (a.riskScore || 0) - (b.riskScore || 0),
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
      <Title level={2}>Risk Assessment</Title>

      <Card className="dashboard-card">
        <Paragraph>
          Our risk assessment algorithm calculates a risk score (0-100) for each customer based on three key factors:
        </Paragraph>
        <ul>
          <li>
            <strong>Credit Score (40%):</strong> Higher credit scores reduce risk
          </li>
          <li>
            <strong>Loan Repayment History (30%):</strong> Consistent payments reduce risk
          </li>
          <li>
            <strong>Outstanding Loans to Income Ratio (30%):</strong> Lower ratios reduce risk
          </li>
        </ul>
        <Paragraph>
          <strong>Risk Levels:</strong>
          <Tag color="#52c41a" style={{ marginLeft: 8 }}>
            Low Risk (0-29)
          </Tag>
          <Tag color="#faad14" style={{ marginLeft: 8 }}>
            Medium Risk (30-59)
          </Tag>
          <Tag color="#ff4d4f" style={{ marginLeft: 8 }}>
            High Risk (60-100)
          </Tag>
        </Paragraph>
      </Card>

      <Card
        title="Customer Risk Assessment"
        className="dashboard-card"
        style={{ marginTop: "24px" }}
        extra={
          <Row gutter={16} align="middle">
            <Col>
              <Select
                placeholder="Filter by risk level"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => setRiskFilter(value)}
              >
                <Option value="low">Low Risk</Option>
                <Option value="medium">Medium Risk</Option>
                <Option value="high">High Risk</Option>
              </Select>
            </Col>
            <Col>
              <Search
                placeholder="Search customers"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
            </Col>
          </Row>
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

export default RiskAssessment
