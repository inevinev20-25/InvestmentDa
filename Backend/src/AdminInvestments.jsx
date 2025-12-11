import React, { useEffect, useState } from "react";

export default function AdminInvestments() {
  const adminToken = localStorage.getItem("adminToken");

  const [investments, setInvestments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    investmentType: "",
    amount: "",
    status: "",
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    const res = await fetch("http://localhost:5000/api/admin/investments", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    const data = await res.json();
    setInvestments(data.data || []);
  };

  const openEdit = (inv) => {
    setEditing(inv);
    setForm({
      investmentType: inv.investmentType,
      amount: inv.amount,
      status: inv.status,
    });
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:5000/api/admin/investments/${editing._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setEditing(null);
    fetchInvestments();
  };

  const deleteInv = async (id) => {
    if (!window.confirm("Delete this investment?")) return;

    await fetch(`http://localhost:5000/api/admin/investments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    fetchInvestments();
  };

  return (
    <div className="admin-invest-wrapper">

      {/* PAGE HEADER */}
      <div className="admin-header">
        <h1>All Investments</h1>
      </div>

      {/* TABLE CONTAINER */}
      <div className="admin-card">
        <div className="table-responsive">

          <table className="admin-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Investment Type</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {investments.map((inv) => (
                <tr key={inv._id}>
                  <td data-label="User ID">{inv.userId}</td>
                  <td data-label="Investment Type">{inv.investmentType}</td>
                  <td data-label="Amount">A${inv.amount}</td>
                  <td data-label="Start Date">{inv.startDate}</td>

                  <td data-label="Status">
                    <span className={`badge ${inv.status}`}>{inv.status}</span>
                  </td>

                  <td data-label="Actions" className="action-buttons">
                    <button className="edit-btn" onClick={() => openEdit(inv)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => deleteInv(inv._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="modal-overlay">
          <div className="modal-box">
            <span className="modal-close" onClick={() => setEditing(null)}>×</span>

            <h2>Edit Investment</h2>

            <input
              value={form.investmentType}
              onChange={(e) => setForm({ ...form, investmentType: e.target.value })}
              placeholder="Investment Type"
            />

            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Amount"
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button className="save-btn" onClick={saveEdit}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* INLINE CSS (Full responsive UI) */}
      <style>{`
        
        .admin-invest-wrapper {
          padding: 25px;
          min-height: 100vh;
          background: #f4f6fb;
        }

        .admin-header h1 {
          margin: 0 0 20px 0;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .admin-card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: #f1f1f1;
          padding: 14px;
          text-align: left;
          font-size: 0.95rem;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .edit-btn {
          background: #007bff;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .delete-btn {
          background: #d9534f;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
        }

        .badge {
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          font-size: 0.85rem;
        }

        .badge.Active {
          background: #28a745;
        }

        .badge.Completed {
          background: #007bff;
        }

        .badge.Cancelled {
          background: #dc3545;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 999;
        }

        .modal-box {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          position: relative;
        }

        .modal-close {
          position: absolute;
          right: 16px;
          top: 12px;
          font-size: 26px;
          cursor: pointer;
        }

        .modal-box input,
        .modal-box select {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .save-btn {
          width: 100%;
          padding: 12px;
          background: #000;
          color: white;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
        }

        /* RESPONSIVE TABLE → CARD MODE */
        @media (max-width: 768px) {

          .admin-table thead {
            display: none;
          }

          .admin-table tr {
            display: block;
            background: #fafafa;
            margin-bottom: 15px;
            padding: 12px;
            border-radius: 10px;
          }

          .admin-table td {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: none;
          }

          .admin-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #666;
          }

          .action-buttons {
            justify-content: flex-end;
          }
        }

      `}</style>

    </div>
  );
}
