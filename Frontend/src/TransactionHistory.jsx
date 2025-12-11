import React, { useEffect, useState } from "react";
import axios from "axios";
 
export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
 
  const API_BASE = "http://localhost:5000/api";
 
  useEffect(() => {
    fetchHistory();
  }, []);
 
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/money-requests/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      const filtered = res.data.filter((t) =>
        ["APPROVED", "COMPLETED", "REJECTED"].includes(t.status)
      );
 
      setTransactions(filtered);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const badgeClass = (status) => {
    switch (status) {
      case "APPROVED":
        return "badge bg-success";
      case "REJECTED":
        return "badge bg-danger";
      case "COMPLETED":
        return "badge bg-primary";
      default:
        return "badge bg-secondary";
    }
  };
 
  if (loading) return <p className="text-center py-4">Loading...</p>;
 
  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm rounded-4">
            <div className="card-body p-4 p-lg-5">
              <h3 className="fw-bold mb-4 text-center">Transaction History</h3>
 
              {transactions.length === 0 ? (
                <p className="text-muted text-center">No completed transactions found.</p>
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
                      {transactions.map((t) => (
                        <tr key={t._id}>
                          <td>{new Date(t.createdAt).toLocaleString()}</td>
                          <td>{t.type}</td>
                          <td>₹{t.amount}</td>
                          <td>{t.method}</td>
                          <td>
                            <span className={badgeClass(t.status)}>{t.status}</span>
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