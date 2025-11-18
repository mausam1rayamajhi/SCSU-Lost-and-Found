import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);

  const load = () => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
    api.get("/claims").then((res) => setClaims(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/claims/${id}/status`, { status });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Admin dashboard</h1>
      {stats && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card">
            <p className="text-xs text-slate-500">Total items</p>
            <p className="text-2xl font-bold">{stats.total_items}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-500">Total claims</p>
            <p className="text-2xl font-bold">{stats.total_claims}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-500">Claims by status</p>
            <ul className="mt-1 text-xs">
              {stats.claims_by_status.map((c) => (
                <li key={c.status}>
                  {c.status}: {c.count}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold mb-2 text-sm">Pending claims</h2>
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="th">ID</th>
              <th className="th">Item</th>
              <th className="th">Claimer</th>
              <th className="th">Note</th>
              <th className="th">Status</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} className="tr">
                <td className="py-2">{c.id}</td>
                <td>{c.item_id}</td>
                <td>{c.claimer_id}</td>
                <td className="max-w-xs truncate">{c.note}</td>
                <td>{c.status}</td>
                <td className="space-x-1">
                  {c.status === "pending" && (
                    <>
                      <button
                        className="btn-primary text-xs px-2 py-1"
                        onClick={() => updateStatus(c.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-primary text-xs px-2 py-1 bg-slate-200 text-scsuRed hover:bg-slate-300"
                        onClick={() => updateStatus(c.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={6} className="py-3 text-center text-slate-500">
                  No claims.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
