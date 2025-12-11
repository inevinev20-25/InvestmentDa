import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
 
export default function ActiveInvestments() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
 
  const [investments, setInvestments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
 
  const [form, setForm] = useState({
    investmentType: "",
    amount: "",
    startDate: "",
  });
 
  // FETCH INVESTMENTS
  const fetchInvestments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/investments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvestments(data.success ? data.investments : []);
    } catch (err) {
      console.error("Fetch investments error:", err);
    }
  };
 
  useEffect(() => {
    fetchInvestments();
  }, []);
 
  // ADD INVESTMENT
  const addInvestment = async () => {
    if (!form.investmentType || !form.amount || !form.startDate) {
      return alert("All fields are required");
    }
 
    try {
      const res = await fetch("http://localhost:5000/api/investments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          investmentType: form.investmentType,
          amount: Number(form.amount),
          startDate: form.startDate,
        }),
      });
 
      const data = await res.json();
 
      if (!data.success) {
        alert(data.message || "Failed to add investment");
        return;
      }
 
      alert("Investment Added!");
      setShowAddModal(false);
      setForm({ investmentType: "", amount: "", startDate: "" });
      fetchInvestments();
    } catch (err) {
      console.error("Add investment error:", err);
    }
  };
 
  return (
    <div className="container my-4">
 
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h1 className="h3 fw-bold mb-3 mb-md-0">Active Investments</h1>
        <button
          className="btn btn-success btn-lg"
          onClick={() => setShowAddModal(true)}
        >
          + Add Investment
        </button>
      </div>
 
      {/* INVESTMENTS LIST */}
      <div className="bg-white p-4 rounded shadow-sm">
        {investments.length === 0 ? (
          <div className="text-center text-muted py-5">No active investments</div>
        ) : (
          <div className="row g-4">
            {investments.map((inv) => (
              <div className="col-12 col-md-6 col-lg-4" key={inv._id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{inv.investmentType}</h5>
                    <p className="mb-1"><strong>Amount:</strong> A${inv.amount}</p>
                    <p className="mb-1"><strong>Start Date:</strong> {inv.startDate}</p>
                    <p className="mb-0"><strong>Status:</strong> {inv.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
 
      {/* ADD INVESTMENT MODAL */}
      {showAddModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog"
            style={{ maxWidth: "450px", width: "100%" }}
          >
            <div className="modal-content p-4 rounded shadow">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="modal-title fw-bold">Add Investment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
 
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Investment Type"
                  value={form.investmentType}
                  onChange={(e) =>
                    setForm({ ...form, investmentType: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="form-control"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </div>
 
              <button
                className="btn btn-primary w-100 fw-semibold"
                onClick={addInvestment}
              >
                Save Investment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 