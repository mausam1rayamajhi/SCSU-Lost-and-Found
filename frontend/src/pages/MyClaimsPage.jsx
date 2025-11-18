import { useEffect, useState } from "react";
import api from "../api/client";

export default function MyClaimsPage() {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    api
      .get("/claims/me")
      .then((res) => setClaims(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">My claims</h1>
      <div className="card">
        {claims.length === 0 ? (
          <p className="text-xs text-slate-500">
            You have not submitted any claims yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="th">Claim ID</th>
                <th className="th">Item ID</th>
                <th className="th">Status</th>
                <th className="th">Note</th>
                <th className="th">Created</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="tr text-xs">
                  <td className="py-2">{c.id}</td>
                  <td>{c.item_id}</td>
                  <td>{c.status}</td>
                  <td className="max-w-xs truncate">{c.note}</td>
                  <td>{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
