import type React from "react"
import { Layout, Button, Space, Typography, Tooltip } from "antd"
import { BulbOutlined, BulbFilled } from "@ant-design/icons"
import { useTheme } from "../../context/ThemeContext"
import "./AppHeader.css" // Add this line

const { Header } = Layout
const { Title } = Typography

const AppHeader: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Header className="header-container" style={{ background: isDarkMode ? "#141414" : "#fff" }}>
      <Title level={4} style={{ margin: 0, color: isDarkMode ? "#fff" : "inherit" }}>
        Credit Risk Analytics Dashboard
      </Title>
      <Space>
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <Button
            type="text"
            onClick={toggleTheme}
            className="theme-toggle-button"
            style={{ color: isDarkMode ? "yellow" : "#fff", backgroundColor: isDarkMode? "gray": "black" }}
            icon={
              <span className={`theme-icon ${isDarkMode ? "animate-icon" : ""}`}>
                {isDarkMode ? <BulbFilled /> : <BulbOutlined />}
              </span>
            }
          />
        </Tooltip>
      </Space>
    </Header>
  )
}

export default AppHeader
