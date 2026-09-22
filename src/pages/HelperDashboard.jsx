import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useOrders } from '../context/OrdersContext';
import './HelperDashboard.css';

const DELIVERY_FLOW = {
  packed: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

function nextDeliveryStatus(current) {
  return DELIVERY_FLOW[current] || current;
}

function statusLabel(status) {
  const labels = {
    packed: 'Ready to pick up',
    out_for_delivery: 'Out for delivery',
    delivered: 'Delivered',
  };
  return labels[status] || status;
}

export default function HelperDashboard() {
  const { orders, updateOrderStatus, DELIVERY_FEE } = useOrders();
  const [filter, setFilter] = useState('active');

  const deliveryOrders = orders.filter((o) => o.deliveryType === 'room');
  const active = deliveryOrders.filter((o) => !['delivered', 'completed'].includes(o.status));
  const displayed =
    filter === 'active'
      ? active
      : filter === 'all'
        ? deliveryOrders
        : deliveryOrders.filter((o) => o.status === filter);

  const earningsToday = deliveryOrders.filter((o) => o.status === 'delivered').length * DELIVERY_FEE;

  const advanceOrder = (id, currentStatus) => {
    updateOrderStatus(id, nextDeliveryStatus(currentStatus));
  };

  return (
    <div className="dashboard-layout">
      <Navbar variant="helper" />
      <main className="page page--wide helper-dash">
        <header className="dash-header">
          <div>
            <h1>Helper dashboard</h1>
            <p className="dash-header__sub">
              Pick packed orders from canteen and deliver to hostel rooms — you earn ₹{DELIVERY_FEE} per delivery
            </p>
          </div>
          <div className="helper-dash__earnings card">
            <strong>₹{earningsToday}</strong>
            <span>earned today (demo)</span>
          </div>
        </header>

        <div className="helper-info card">
          <p>
            <strong>How it works:</strong> Canteen marks online orders as <em>packed</em>.
            You pick them up, deliver to the room shown, then mark <em>delivered</em>.
          </p>
        </div>

        <div className="helper-filters">
          {[
            { key: 'active', label: 'To deliver' },
            { key: 'packed', label: 'Packed (pick up)' },
            { key: 'out_for_delivery', label: 'On the way' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'all', label: 'All' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              className={`helper-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state__icon">🛵</div>
            <p>No room-delivery orders in this view. Check back when canteen marks orders packed.</p>
          </div>
        ) : (
          <div className="helper-orders">
            {displayed.map((order) => (
              <article key={order.id} className={`helper-order card helper-order--${order.status}`}>
                <div className="helper-order__top">
                  <div>
                    <strong className="helper-order__id">{order.id}</strong>
                    <span className="helper-order__time">{order.time}</span>
                  </div>
                  <span className={`badge badge--${order.status}`}>{statusLabel(order.status)}</span>
                </div>
                <p className="helper-order__student">{order.student}</p>
                <p className="helper-order__items">{order.items}</p>
                <div className="helper-order__location">
                  <span>📍 Room {order.room}, {order.block}</span>
                </div>
                <div className="helper-order__footer">
                  <div>
                    <span className="helper-order__total">₹{order.total}</span>
                    <span className="helper-order__fee">+ ₹{DELIVERY_FEE} for you</span>
                  </div>
                  {order.status === 'packed' && (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => advanceOrder(order.id, order.status)}
                    >
                      Picked up — start delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => advanceOrder(order.id, order.status)}
                    >
                      Mark delivered
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer variant="minimal" />
    </div>
  );
}
