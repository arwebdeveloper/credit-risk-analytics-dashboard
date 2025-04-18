import { ConfigProvider, Layout, theme } from "antd"
import { Routes, Route } from "react-router-dom"
import { useTheme } from "./context/ThemeContext"
import AppHeader from "./components/layout/AppHeader"
import AppSidebar from "./components/layout/AppSidebar"
import Dashboard from "./pages/Dashboard"
import RiskAssessment from "./pages/RiskAssessment"
import Workflow from "./pages/Workflow"
import "./App.css"

const { Content } = Layout

function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { isDarkMode } = useTheme()

  return (
    <ConfigProvider  theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
    <Layout className={`app-container ${isDarkMode ? "dark" : "light"}`}>
      <AppSidebar />
      <Layout>
        <AppHeader />
        <Content className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/workflow" element={<Workflow />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
    </ConfigProvider>
  )
}

export default App
