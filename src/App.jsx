
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import FoodMenu from './pages/FoodMenu';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import HelperDashboard from './pages/HelperDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <FoodMenu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/helper"
        element={
          <ProtectedRoute allowedRoles={['helper']}>
            <HelperDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
