"use client";

import type React from "react";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  WarningOutlined,
  ApartmentOutlined,
  FundOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const { Sider } = Layout;

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/risk-assessment",
      icon: <WarningOutlined />,
      label: "Risk Assessment",
    },
    {
      key: "/workflow",
      icon: <ApartmentOutlined />,
      label: "Workflow",
    },
  ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      theme={isDarkMode ? "dark" : "light"}
    >
      <div className="logo" >
        <FundOutlined style={{marginRight: "8px"}}/>
        CRA
      </div>
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSidebar;
