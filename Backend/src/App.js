import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminUsers from "./AdminUsers"; 
import AdminLogin from "./AdminLogin";
import UserDetails from "./UserDetails";
import MoneyRequestsPage from "./MoneyRequestsPage";
import Layout from "./Layout";
import TransactionHistory from "./TransactionHistory";
import Profile from "./Profile";

import AdminLayout from "./AdminLayout";
import AdminTransactions from "./AdminTransactions";
import AdminSettings from "./AdminSettings";
import AdminInvestments from "./AdminInvestments";   // ⭐ ADMIN INVESTMENTS

import ActiveInvestments from "./ActiveInvestments";  // ⭐ USER INVESTMENTS


export default function App() {
  const isAuth = () => !!localStorage.getItem("token");
  const isAdmin = () => !!localStorage.getItem("adminToken");

  return (
    <Router>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />


        {/* ========== ADMIN ROUTES ========== */}
        <Route
          path="/admin/users"
          element={
            isAdmin() ? (
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            ) : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/admin/transactions"
          element={
            isAdmin() ? (
              <AdminLayout>
                <AdminTransactions />
              </AdminLayout>
            ) : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/users/:id"
          element={
            isAdmin() ? (
              <AdminLayout>
                <UserDetails />
              </AdminLayout>
            ) : <Navigate to="/admin-login" />
          }
        />

        <Route
          path="/admin/settings"
          element={
            isAdmin() ? (
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            ) : <Navigate to="/admin-login" />
          }
        />

        {/* ⭐ NEW — ADMIN INVESTMENT MANAGEMENT */}
        <Route
          path="/admin/investments"
          element={
            isAdmin() ? (
              <AdminLayout>
                <AdminInvestments />
              </AdminLayout>
            ) : <Navigate to="/admin-login" />
          }
        />

        {/* ========== USER ROUTES ========== */}
        <Route
          path="/dashboard"
          element={
            isAuth() ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />

        <Route
          path="/money-requests"
          element={
            isAuth() ? (
              <Layout>
                <MoneyRequestsPage />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />

        <Route
          path="/transactions"
          element={
            isAuth() ? (
              <Layout>
                <TransactionHistory />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />

        {/* ⭐ USER ACTIVE INVESTMENTS ROUTE */}
        <Route
          path="/active-investments"
          element={
            isAuth() ? (
              <Layout>
                <ActiveInvestments />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />

        <Route
          path="/profile"
          element={
            isAuth() ? (
              <Layout>
                <Profile />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}
