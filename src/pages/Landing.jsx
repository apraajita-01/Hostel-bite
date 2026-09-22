import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LandingStats from '../components/LandingStats';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <Navbar variant="public" />

      <section className="hero">
        <div className="hero__content">
          <span className="hero__tag">Hostel delivery · ₹10 to your room</span>
          <h1>Order online.<br />Eat in your room.</h1>
          <p className="hero__subtitle">
            Browse the canteen menu, place an order online, and choose room delivery.
            Student helpers earn a small fee delivering straight to your hostel door.
          </p>
          <div className="hero__actions">
            <Link to="/login" className="btn btn--primary btn--lg">
              Order online
            </Link>
            <a href="#how-it-works" className="btn btn--secondary btn--lg">
              How it works
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__plate">🏠</div>
          <div className="hero__float hero__float--1">🍛</div>
          <div className="hero__float hero__float--2">📦</div>
          <div className="hero__float hero__float--3">🛵</div>
        </div>
      </section>

      <section id="features" className="features page">
        <h2>Built for hostel life</h2>
        <div className="features__grid">
          <article className="feature-card card">
            <span className="feature-card__icon">📱</span>
            <h3>Order online</h3>
            <p>Students order from the menu anytime — no queue at the counter during rush hour.</p>
          </article>
          <article className="feature-card card">
            <span className="feature-card__icon">🏠</span>
            <h3>₹10 room delivery</h3>
            <p>Pay a minimal delivery charge. A student helper brings food to your room number.</p>
          </article>
          <article className="feature-card card">
            <span className="feature-card__icon">👨‍🍳</span>
            <h3>Canteen + helpers</h3>
            <p>Canteen staff pack online orders. Helpers pick up and deliver across hostel blocks.</p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="steps page">
        <h2>How it works</h2>
        <ol className="steps__list">
          <li>
            <strong>Student orders online</strong> — pick items, choose room delivery (₹10) or free counter pickup.
          </li>
          <li>
            <strong>Canteen packs</strong> — admin sees online orders and marks them packed for handoff.
          </li>
          <li>
            <strong>Helper delivers</strong> — student helper picks up the bag and goes to your room &amp; block.
          </li>
          <li>
            <strong>You receive</strong> — track status until it&apos;s at your door or ready at the counter.
          </li>
        </ol>
      </section>

      <LandingStats />

      <Footer variant="full" />
    </div>
  );
}
