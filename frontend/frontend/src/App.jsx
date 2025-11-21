import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BrowsePage from "./pages/BrowsePage";
import ReportItemPage from "./pages/ReportItemPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import MyClaimsPage from "./pages/MyClaimsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<BrowsePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-claims"
          element={
            <ProtectedRoute>
              <MyClaimsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Layout>
  );
}
