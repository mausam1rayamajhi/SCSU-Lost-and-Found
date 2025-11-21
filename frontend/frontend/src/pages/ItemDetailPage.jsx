import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState(null);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch(console.error);
  }, [id]);

  const onClaim = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!id) return;
    try {
      await api.post("/claims", { item_id: Number(id), note });
      setNote("");
      setMessage("Claim submitted successfully. Campus staff will review it.");
    } catch (err) {
      setMessage(
        err.response?.data?.detail ??
          "Failed to submit claim. Are you logged in?"
      );
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
      <div className="card">
        {item.image_url && (
          <img
            src={item.image_url}
            className="w-full max-h-72 object-cover rounded-lg mb-3 border border-slate-200"
          />
        )}
        <h1 className="text-xl font-semibold mb-1">{item.title}</h1>
        <p className="text-sm text-slate-600 mb-2">{item.description}</p>
        <div className="text-xs text-slate-500 space-y-1">
          <p>
            <span className="font-semibold">Status:</span> {item.status}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {item.category}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {item.location}
          </p>
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold mb-2">Claim this item</h2>
        {!token && (
          <p className="text-xs text-slate-500 mb-2">
            Please log in to submit a claim.
          </p>
        )}
        <form onSubmit={onClaim} className="space-y-3">
          <div>
            <label className="text-xs font-semibold block mb-1">
              Describe why you believe this is yours
            </label>
            <textarea
              className="input min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add identifying details like serial number, unique markings, etc."
            />
          </div>
          <button className="btn-primary w-full" type="submit" disabled={!token}>
            Submit claim
          </button>
        </form>
        {message && <p className="text-xs text-slate-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}
