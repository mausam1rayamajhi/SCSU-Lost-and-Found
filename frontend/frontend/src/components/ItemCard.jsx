import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="block card hover:shadow-md">
      <div className="flex gap-4">
        {item.image_url && (
          <img
            src={item.image_url}
            className="w-24 h-24 rounded-lg object-cover border border-slate-200"
          />
        )}
        <div className="flex-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold">{item.title}</h3>
            <span className="text-xs rounded-full px-2 py-0.5 bg-slate-100">
              {item.status.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>{item.category}</span>
            <span>{item.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
