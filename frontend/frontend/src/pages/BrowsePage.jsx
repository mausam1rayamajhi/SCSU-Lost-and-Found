import { useEffect, useState } from "react";
import api from "../api/client";
import ItemCard from "../components/ItemCard";

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const load = () => {
    api
      .get("/items", {
        params: {
          q: q || undefined,
          status: status || undefined,
        },
      })
      .then((res) => setItems(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Browse items</h1>
      <div className="card flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs font-semibold block mb-1">Search</label>
          <input
            className="input"
            placeholder="Laptop, blue backpack..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Any</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <button className="btn-primary" onClick={load}>
          Apply filters
        </button>
      </div>
      <div className="grid gap-3">
        {items.map((i) => (
          <ItemCard key={i.id} item={i} />
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-500">No items found.</p>
        )}
      </div>
    </div>
  );
}
