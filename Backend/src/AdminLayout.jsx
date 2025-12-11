import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Admin.css'

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin-login");
  };

  return (
    <div className="admin-container">

      {/* MOBILE MENU BUTTON */}
      <button className="admin-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="admin-logo">Admin Panel</div>

        <button className="admin-link" onClick={() => navigate("/admin/users")}>Users</button>
        <button className="admin-link" onClick={() => navigate("/admin/transactions")}>Transactions</button>
        <button className="admin-link" onClick={() => navigate("/admin/investments")}>Investments</button>
        <button className="admin-link" onClick={() => navigate("/admin/settings")}>Settings</button>

        <button className="admin-link logout" onClick={logout}>Sign Out</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {children}
      </main>

      <style>{`
        /***********************
          MAIN WRAPPER
        ***********************/
        .admin-container {
          display: flex;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /***********************
          SIDEBAR
        ***********************/
        .admin-sidebar {
          width: 240px;
          background: #0f172a;
          color: white;
          padding: 20px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: transform 0.3s ease;
          transform: translateX(0); /* desktop default */
        }

        .admin-logo {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 25px;
        }

        .admin-link {
          padding: 12px;
          background: transparent;
          border: none;
          text-align: left;
          color: white;
          font-size: 1rem;
          border-bottom: 1px solid #1e293b;
          cursor: pointer;
        }

        .admin-link:hover {
          background: #1e293b;
        }

        .logout {
          background: #dc2626 !important;
          border-radius: 6px;
          margin-top: auto;
          text-align: center;
        }

        /***********************
          MAIN CONTENT
        ***********************/
        .admin-main {
          flex: 1;
          width: 100%;
          padding: 25px;
          margin-left: 240px;  /* <<< THIS FIXES DESKTOP */
          height: 100vh;
          overflow-y: auto;
          background: #f8f9fb;
          transition: margin-left 0.3s ease;
        }

        /***********************
          MOBILE BUTTON
        ***********************/
        .admin-toggle {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          padding: 8px 12px;
          font-size: 22px;
          background: #0f172a;
          color: white;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          z-index: 1001;
        }

        /***********************
          RESPONSIVE
        ***********************/
        @media (max-width: 900px) {
          
          .admin-toggle {
            display: block;
          }

          /* hide sidebar by default */
          .admin-sidebar {
            transform: translateX(-100%);
          }

          /* when open */
          .admin-sidebar.show {
            transform: translateX(0);
          }

          /* content takes full width */
          .admin-main {
            margin-left: 0 !important;
          }
        }

      `}</style>
    </div>
  );
}
