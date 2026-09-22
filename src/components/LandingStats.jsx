import { useEffect, useState } from 'react';
import { useOrders } from '../context/OrdersContext';
import './LandingStats.css';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display.toLocaleString('en-IN')}</span>;
}

export default function LandingStats() {
  const { stats, refreshStats } = useOrders();

  useEffect(() => {
    refreshStats();
    const onStorage = () => refreshStats();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshStats]);

  const items = [
    {
      value: stats.totalUsers,
      label: 'Registered users',
      hint: 'Students, helpers & canteen staff who have signed in',
      icon: '👥',
    },
    {
      value: stats.students,
      label: 'Students',
      hint: 'Ordering meals from hostel rooms',
      icon: '🎓',
    },
    {
      value: stats.onlineOrders,
      label: 'Online orders placed',
      hint: 'Orders submitted through the app',
      icon: '📦',
    },
    {
      value: stats.roomDeliveries,
      label: 'Room deliveries completed',
      hint: '₹10 helper delivery to your door',
      icon: '🏠',
    },
  ];

  return (
    <section id="stats" className="landing-stats page">
      <div className="landing-stats__header">
        <h2>Platform at a glance</h2>
        <p>Live numbers from everyone using Campus Canteen on this device &amp; browser</p>
      </div>
      <div className="landing-stats__grid">
        {items.map((item) => (
          <article key={item.label} className="landing-stats__card card">
            <span className="landing-stats__icon" aria-hidden="true">
              {item.icon}
            </span>
            <div className="landing-stats__value">
              <AnimatedNumber value={item.value} />
            </div>
            <h3>{item.label}</h3>
            <p>{item.hint}</p>
          </article>
        ))}
      </div>
      {stats.helpers > 0 && (
        <p className="landing-stats__footnote">
          {stats.helpers} student helper{stats.helpers !== 1 ? 's' : ''} registered ·{' '}
          {stats.activeDeliveries} delivery in progress right now
        </p>
      )}
    </section>
  );
}
