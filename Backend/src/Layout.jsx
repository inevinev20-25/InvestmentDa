import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">

      {/* Toggle Button (Mobile/Tablet) */}
      <button
        className="toggle-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <div className={`layout-content ${sidebarOpen ? "shift" : ""}`}>
        {children}
      </div>
    </div>
  );
}
