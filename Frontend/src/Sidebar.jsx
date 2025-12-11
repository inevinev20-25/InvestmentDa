import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`}>
      <div className="sidebar-logo">Client Panel</div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className="sidebar-item" onClick={closeSidebar}>
          Dashboard
        </Link>

        <Link to="/money-requests" className="sidebar-item" onClick={closeSidebar}>
          Money Requests
        </Link>

        <Link to="/transactions" className="sidebar-item" onClick={closeSidebar}>
          Transactions
        </Link>

        <Link to="/active-investments" className="sidebar-item" onClick={closeSidebar}>
          Active Investments
        </Link>

        <Link to="/profile" className="sidebar-item" onClick={closeSidebar}>
          Profile
        </Link>
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
