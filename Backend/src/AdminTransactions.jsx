import React, { useEffect, useState } from "react";
 
export default function AdminTransactions() {
  const adminToken = localStorage.getItem("adminToken");
 
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
 
  useEffect(() => { fetchRequests(); }, []);
 
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/transactions", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) { console.error(err); }
  };
 
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch (err) { console.error(err); }
  };
 
  const filtered = requests.filter((r) => {
    const matchSearch =
      r.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" ? true : r.status === filterStatus;
    return matchSearch && matchStatus;
  });
 
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">Transaction Requests</h2>
 
      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <input
          type="text"
          className="form-control flex-grow-1"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 200 }}
        />
 
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ minWidth: 150 }}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
 
      {/* Table */}
      <div className="table-responsive shadow-sm rounded-4 bg-white">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.fullName}</td>
                <td>{r.user?.email}</td>
                <td>{r.type}</td>
                <td>A${r.amount}</td>
                <td>{r.method}</td>
                <td>
                  <span
                    className={`badge text-white px-2 py-1 rounded-3`}
                    style={{
                      background:
                        r.status === "PENDING"
                          ? "#f59e0b"
                          : r.status === "APPROVED"
                          ? "#22c55e"
                          : r.status === "REJECTED"
                          ? "#ef4444"
                          : "#3b82f6",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === "PENDING" && (
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => updateStatus(r._id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => updateStatus(r._id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center mt-3 text-muted">
          No transactions found.
        </div>
      )}
    </div>
  );
}