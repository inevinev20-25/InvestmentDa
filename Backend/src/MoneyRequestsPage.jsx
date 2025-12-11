import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
 
const API_BASE_URL = "http://localhost:5000/api";
 
export default function MoneyRequestsPage() {
  const [type, setType] = useState("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");
  const [note, setNote] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    fetchRequests();
  }, []);
 
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/money-requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/money-requests`,
        { type, amount, method, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmount("");
      setNote("");
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="container py-4 py-md-5">
 
      {/* PAGE TITLE */}
      <h2 className="fw-bold text-center mb-5">
        Money Requests
      </h2>
 
      {/* CREATE REQUEST */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-8">
          <div
            className="card border-0 shadow-lg rounded-4"
            style={{ background: "#ffffff" }}
          >
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-semibold mb-4">
                Create Request
              </h5>
 
              <form onSubmit={handleSubmit}>
                {/* TYPE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Type
                  </label>
                  <div className="d-flex gap-4 flex-wrap">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={type === "DEPOSIT"}
                        onChange={() => setType("DEPOSIT")}
                      />
                      <label className="form-check-label">
                        Deposit
                      </label>
                    </div>
 
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={type === "WITHDRAW"}
                        onChange={() => setType("WITHDRAW")}
                      />
                      <label className="form-check-label">
                        Withdraw
                      </label>
                    </div>
                  </div>
                </div>
 
                {/* AMOUNT */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
 
                {/* METHOD */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Method
                  </label>
                  <select
                    className="form-select form-select-lg"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Card</option>
                  </select>
                </div>
 
                {/* NOTE */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Note (optional)
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Any additional info for admin"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
 
                <button
                  className="btn btn-primary btn-lg w-100 rounded-pill"
                  disabled={loading}
                  style={{ height: "52px" }}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
 
      {/* MY REQUESTS */}
      <div className="row justify-content-center">
        <div className="col-12">
          <div
            className="card border-0 shadow-lg rounded-4"
            style={{ background: "#ffffff" }}
          >
            <div className="card-body p-4">
              <h5 className="fw-semibold mb-4">
                My Requests
              </h5>
 
              {requests.length === 0 ? (
                <div className="text-muted">
                  No requests yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r) => (
                        <tr key={r._id}>
                          <td>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                          <td>{r.type}</td>
                          <td className="fw-semibold">
                            ₹{r.amount}
                          </td>
                          <td>{r.method}</td>
                          <td>
                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                background: "#fff3cd",
                                color: "#856404",
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
 
    </div>
  );
}
 