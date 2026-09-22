import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar({ variant = 'public' }) {
  const { user, logout, isLoggedIn } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/student', label: 'Dashboard' },
    { to: '/menu', label: 'Menu' },
    { to: '/cart', label: 'Order online' },
  ];

  return (
    <header className={`navbar navbar--${variant}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">🍽️</span>
          <span>Campus Canteen</span>
        </Link>

        <nav className="navbar__links">
          {variant === 'public' && (
            <>
              <a href="/#features">Features</a>
              <a href="/#how-it-works">How it works</a>
              {!isLoggedIn && (
                <Link to="/login" className="btn btn--primary btn--sm">
                  Login
                </Link>
              )}
            </>
          )}

          {variant === 'student' && user?.role === 'student' && (
            <>
              {studentLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? 'active' : ''}
                >
                  {link.label}
                  {link.to === '/cart' && itemCount > 0 && (
                    <span className="navbar__cart-badge">{itemCount}</span>
                  )}
                </Link>
              ))}
            </>
          )}

          {variant === 'admin' && (
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              Admin
            </Link>
          )}

          {variant === 'helper' && (
            <Link to="/helper" className={location.pathname === '/helper' ? 'active' : ''}>
              Orders
            </Link>
          )}

          {isLoggedIn && (
            <div className="navbar__user">
              <span className="navbar__name">{user.name}</span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
