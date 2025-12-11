import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("single");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    fullName: "",
    email: "",
    password: "",
    accountType: "single",
    dob: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (
      !form.title ||
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.dob ||
      !form.address1 ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.country
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        accountType: activeTab,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      if (res.data.success) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="signup-container">
        <div className="signup-card">
          {/* ---- TAB SWITCH ---- */}
          <div className="tab-row">
            <button
              className={activeTab === "single" ? "tab active" : "tab"}
              onClick={() => setActiveTab("single")}
            >
              Single Account
            </button>

            <button
              className={activeTab === "joint" ? "tab active" : "tab"}
              onClick={() => setActiveTab("joint")}
            >
              Joint Account
            </button>
          </div>

          {/* ---- FORM ---- */}
          <form className="form-section" onSubmit={handleSubmit}>
            <h3 className="form-title">Primary Account Holder</h3>

            <div className="row">
              <div className="field">
                <label>Title *</label>
                <select name="title" value={form.title} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Ms">Ms</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>

              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="field">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Choose password"
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 000 000 0000"
                />
              </div>
            </div>

            <div className="field full">
              <label>Address Line 1 *</label>
              <input
                type="text"
                name="address1"
                value={form.address1}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="field full">
              <label>Address Line 2 (Optional)</label>
              <input
                type="text"
                name="address2"
                value={form.address2}
                onChange={handleChange}
                placeholder="Apartment, suite, etc"
              />
            </div>

            <div className="row">
              <div className="field">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>State / Province *</label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="create-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
