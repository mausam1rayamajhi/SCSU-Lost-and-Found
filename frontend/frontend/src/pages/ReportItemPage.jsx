import { useState } from "react";
import api from "../api/client";

export default function ReportItemPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("lost");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics");
  const [location, setLocation] = useState("");
  const [valueLevel, setValueLevel] = useState("low");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post("/items", {
        title,
        description,
        category,
        location,
        status: type,
        value_level: valueLevel,
        is_high_value: valueLevel === "high",
        tags,
        image_url: imageUrl || null,
      });
      setMessage("Item submitted successfully.");
      setTitle("");
      setDescription("");
      setLocation("");
      setTags("");
      setImageUrl("");
      setType("lost");
      setValueLevel("low");
    } catch (err) {
      setMessage(err.response?.data?.detail ?? "Failed to submit item.");
    }
  };

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-lg font-semibold mb-4">Report lost / found item</h1>
      {message && <p className="text-xs text-slate-600 mb-2">{message}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Type</label>
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Category</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="book">Book</option>
              <option value="accessories">Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Black Dell laptop..."
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Location</label>
          <input
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Atwood, Library, ECS building..."
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Description</label>
          <textarea
            className="input min-h-[80px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe color, brand, stickers, etc."
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">
              Value level
            </label>
            <select
              className="input"
              value={valueLevel}
              onChange={(e) => setValueLevel(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">
              Tags (comma-separated)
            </label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="laptop, dell, black"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Image URL</label>
          <input
            className="input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <button className="btn-primary w-full" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
