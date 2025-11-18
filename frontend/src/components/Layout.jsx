import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const navLink =
  "px-3 py-1 rounded-md text-sm hover:bg-white/10 transition-colors";

export default function Layout({ children }) {
  const { token, role, setToken, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("lf_token");
    if (stored) setToken(stored);
  }, [setToken]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-scsuRed text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold text-lg">
            Lost &amp; Found @ SCSU
          </Link>
          <nav className="flex gap-2 text-xs sm:text-sm items-center">
            <NavLink to="/items" className={navLink}>
              Browse
            </NavLink>
            <NavLink to="/report" className={navLink}>
              Report
            </NavLink>

            {/* visible only when logged in */}
            {token && (
              <NavLink to="/my-claims" className={navLink}>
                My Claims
              </NavLink>
            )}

            {/* visible only for admins */}
            {role === "admin" && (
              <NavLink to="/admin" className={navLink}>
                Admin
              </NavLink>
            )}

            {!token ? (
              <>
                <NavLink to="/login" className={navLink}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLink}>
                  Register
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className={navLink}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
