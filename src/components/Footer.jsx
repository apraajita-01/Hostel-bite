import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer({ variant = 'full' }) {
  const year = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className="footer footer--minimal">
        <div className="footer__inner">
          <p>© {year} Campus Canteen</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer footer--full">
      <div className="footer__main">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand">
              <span className="footer__logo">🍽️</span>
              Campus Canteen
            </Link>
            <p className="footer__tagline">
              Order online from the canteen. Student helpers deliver to your hostel room for just ₹10.
            </p>
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><a href="/#features">Features</a></li>
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#stats">Platform stats</a></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>For students</h4>
            <ul>
              <li><Link to="/login">Order online</Link></li>
              <li><span>Room delivery — ₹10</span></li>
              <li><span>Pickup at counter — free</span></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>For teams</h4>
            <ul>
              <li><span>Canteen — pack online orders</span></li>
              <li><span>Helpers — deliver to rooms</span></li>
              <li><a href="mailto:canteen@campus.edu">canteen@campus.edu</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p>© {year} Campus Canteen. All rights reserved.</p>
          <p className="footer__bottom-note">Hostel delivery · Online ordering · Built for campus life</p>
        </div>
      </div>
    </footer>
  );
}
