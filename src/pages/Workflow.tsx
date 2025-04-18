"use client"

import type React from "react"

import { useState } from "react"
import {
  Card,
  Table,
  Tag,
  Select,
  Button,
  notification,
  Spin,
  Alert,
  Typography,
  Space,
  Modal,
  Form,
  Input,
} from "antd"
import { ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import type { Customer } from "../types"
import { useCustomers } from "../hooks/useCustomers"
import { getRiskLevel, getRiskColor } from "../utils/riskCalculator"
import { updateCustomerStatus, createAlert } from "../services/api"
import { useTheme } from "../context/ThemeContext"

const { Title, Paragraph } = Typography
const { Option } = Select
const { confirm } = Modal

const Workflow: React.FC = () => {
  const { customers, setCustomers, loading, error } = useCustomers()
  const [updatingCustomerId, setUpdatingCustomerId] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [form] = Form.useForm()
  const { isDarkMode } = useTheme()

  // Handle status change
  const handleStatusChange = async (customerId: string, newStatus: "Review" | "Approved" | "Rejected") => {
    try {
      setUpdatingCustomerId(customerId)

      // Update status via API
      await updateCustomerStatus(customerId, newStatus)

      // Update local state
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerId === customerId ? { ...customer, status: newStatus } : customer,
        ),
      )

      notification.success({
        message: "Status Updated",
        description: `Customer ${customerId} status changed to ${newStatus}`,
      })

      // Create alert for high-risk customers that are approved
      const customer = customers.find((c) => c.customerId === customerId)
      if (customer && customer.riskScore && customer.riskScore > 70 && newStatus === "Approved") {
        await createAlert(customerId, customer.riskScore)

        notification.warning({
          message: "High Risk Alert Created",
          description: `Alert created for high-risk customer ${customerId}`,
        })
      }
    } catch (err) {
      console.error("Error updating status:", err)
      notification.error({
        message: "Update Failed",
        description: "Failed to update customer status. Please try again.",
      })
    } finally {
      setUpdatingCustomerId(null)
    }
  }

  // Show confirmation modal for status change
  const showStatusConfirm = (customer: Customer, newStatus: "Review" | "Approved" | "Rejected") => {
    const riskLevel = getRiskLevel(customer.riskScore || 0)
    const isHighRisk = riskLevel === "High"

    // Show warning for high-risk customers being approved
    if (isHighRisk && newStatus === "Approved") {
      confirm({
        title: "High Risk Warning",
        icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
        content: `This customer has a high risk score of ${customer.riskScore}. Are you sure you want to approve?`,
        okText: "Yes, Approve",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          handleStatusChange(customer.customerId, newStatus)
        },
      })
    } else {
      handleStatusChange(customer.customerId, newStatus)
    }
  }

  // Show customer details modal
  const showCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalVisible(true)
    form.setFieldsValue({
      notes: customer.notes || "",
    })
  }

  // Handle form submission
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      // In a real app, you would save the notes to the backend
      notification.success({
        message: "Notes Saved",
        description: "Customer notes have been saved successfully.",
      })
      setIsModalVisible(false)
    })
  }

  // Table columns
  const columns = [
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "riskScore",
      render: (value: number) => {
        const riskLevel = getRiskLevel(value)
        return (
          <Tag color={getRiskColor(riskLevel)}>
            {value} ({riskLevel})
          </Tag>
        )
      },
      sorter: (a: Customer, b: Customer) => (a.riskScore || 0) - (b.riskScore || 0),
    },
    {
      title: "Current Status",
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
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: "Review", value: "Review" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value: string | number | boolean, record: Customer) => record.status === value,
    },
    {
      title: "Update Status",
      key: "action",
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            loading={updatingCustomerId === record.customerId}
            onChange={(value) => showStatusConfirm(record, value as "Review" | "Approved" | "Rejected")}
          >
            <Option value="Review">Review</Option>
            <Option value="Approved">Approve</Option>
            <Option value="Rejected">Reject</Option>
          </Select>
          <Button type="link" onClick={() => showCustomerDetails(record)}>
            Details
          </Button>
        </Space>
      ),
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
      <Title level={2}>Workflow Management</Title>

      <Card className="dashboard-card">
        <Paragraph>
          This module allows risk officers to review customer applications and update their status. High-risk customers
          that are approved will automatically generate alerts for additional review.
        </Paragraph>
      </Card>

      <Card
        title="Customer Workflow"
        className="dashboard-card"
        style={{ marginTop: "24px" }}
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            Refresh
          </Button>
        }
      >
        <Table
          dataSource={customers}
          columns={columns}
          rowKey="customerId"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      <Modal
        title="Customer Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleFormSubmit}>
            Save Notes
          </Button>,
        ]}
      >
        {selectedCustomer && (
          <div>
            <p>
              <strong>Customer ID:</strong> {selectedCustomer.customerId}
            </p>
            <p>
              <strong>Name:</strong> {selectedCustomer.name}
            </p>
            <p>
              <strong>Monthly Income:</strong> ${selectedCustomer.monthlyIncome.toLocaleString()}
            </p>
            <p>
              <strong>Monthly Expenses:</strong> ${selectedCustomer.monthlyExpenses.toLocaleString()}
            </p>
            <p>
              <strong>Credit Score:</strong> {selectedCustomer.creditScore}
            </p>
            <p>
              <strong>Outstanding Loans:</strong> ${selectedCustomer.outstandingLoans.toLocaleString()}
            </p>
            <p>
              <strong>Account Balance:</strong> ${selectedCustomer.accountBalance.toLocaleString()}
            </p>
            <p>
              <strong>Risk Score:</strong> {selectedCustomer.riskScore}
            </p>

            <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
              <Form.Item name="notes" label="Officer Notes">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Workflow
