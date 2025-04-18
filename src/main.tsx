import React from "react"
import ReactDOM from "react-dom/client"
import { ConfigProvider } from "antd"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
