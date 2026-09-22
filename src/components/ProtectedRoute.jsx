import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoggedIn, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <main className="page">
        <div className="empty-state card">
          <div className="empty-state__icon">⏳</div>
          <p>Checking your sign-in session...</p>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirect =
      user.role === 'admin' ? '/admin' : user.role === 'helper' ? '/helper' : '/student';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
