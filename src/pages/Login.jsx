import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Login.css';

const DEMO_HINTS = [
  { role: 'Student', email: 'student@campus.edu', password: 'student123' },
  { role: 'Admin', email: 'admin@campus.edu', password: 'admin123' },
  { role: 'Helper', email: 'helper@campus.edu', password: 'helper123' },
];

export default function Login() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(getDashboardPath(result.role), { replace: true });
  };

  const createAccount = async () => {
    setError('');
    setIsSubmitting(true);
    const result = await signup({ name, role, email, password });
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(getDashboardPath(result.role), { replace: true });
  };

  const fillDemo = (demo) => {
    setName(demo.role);
    setRole(demo.role.toLowerCase());
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  };

  return (
    <div className="login-page">
      <Navbar variant="public" />
      <main className="login page">
        <div className="login__card card">
          <h1>Welcome back</h1>
          <p className="login__subtitle">
            Sign in or create an account to open your dashboard panel
          </p>

          <form onSubmit={handleSubmit} className="login__form">
            {error && <div className="login__error" role="alert">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Name (for new account)</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account type</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="helper">Helper</option>
                <option value="admin">Canteen Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn--primary login__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : 'Sign in'}
            </button>

            <button
              type="button"
              className="btn btn--secondary login__create"
              onClick={createAccount}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : 'Create account'}
            </button>
          </form>

          <p className="login__back">
            <Link to="/">← Back to home</Link>
          </p>
        </div>

        <aside className="login__demo card">
          <h2>Demo accounts</h2>
          <p className="login__demo-hint">Click a role to fill the form:</p>
          <ul className="login__demo-list">
            {DEMO_HINTS.map((demo) => (
              <li key={demo.role}>
                <button
                  type="button"
                  className="login__demo-btn"
                  onClick={() => fillDemo(demo)}
                >
                  <strong>{demo.role}</strong>
                  <span>{demo.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
