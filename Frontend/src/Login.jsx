import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import API_BASE_URL from "./config";

export default function Login() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter email & password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);

      // BLOCK ADMIN USERS
      if (res.data.user.role === "admin") {
        toast.error("Please login through Admin Login page");
        return;
      }

      toast.success("Login successful!");

      // Save CLIENT TOKEN
      localStorage.setItem("token", res.data.token);

      // Optional: Save user info to avoid extra /me request
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      setTimeout(() => navigate("/dashboard"), 1200);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Welcome Back</h2>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />

                <span
                  className="show-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <button className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="login-switch">
            Don’t have an account? <a href="/signup">Create one</a>
          </p>
        </div>
      </div>
    </>
  );
}
