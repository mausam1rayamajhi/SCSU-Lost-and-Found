import { useEffect, useState } from "react";
import api from "../api/client";
import ItemCard from "../components/ItemCard";

export default function HomePage() {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    api
      .get("/items", { params: { limit: 6 } })
      .then((res) => setRecentItems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[2fr,3fr] items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Lost something on campus?
          </h1>
          <p className="text-sm text-slate-600 mb-4">
            Use SCSU&apos;s lost and found portal to report missing items, browse
            found items, and securely claim what&apos;s yours.
          </p>
          <div className="flex gap-2">
            <a href="/items" className="btn-primary">
              Browse items
            </a>
            <a
              href="/report"
              className="btn-primary bg-white text-scsuRed border border-scsuRed hover:bg-slate-50"
            >
              Report lost / found
            </a>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-3 text-sm">
            Recent activity (7 days)
          </h2>
          {recentItems.length === 0 && (
            <p className="text-xs text-slate-500">
              No items yet. Be the first to report.
            </p>
          )}
          <div className="space-y-3">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
