import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StudentDashboard.css';

function StatusBadge({ status, deliveryType }) {
  const labels = {
    pending: 'Awaiting packaging',
    packed: deliveryType === 'room' ? 'Packed — helper picking up' : 'Ready at counter',
    out_for_delivery: 'On the way to your room',
    delivered: 'Delivered',
    completed: 'Completed',
  };
  return (
    <span className={`badge badge--${status}`}>
      {labels[status] || status}
    </span>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { getStudentOrders, DELIVERY_FEE } = useOrders();

  const myOrders = getStudentOrders(user?.email);
  const activeOrder = myOrders.find(
    (o) => !['delivered', 'completed'].includes(o.status)
  );
  const pastOrders = myOrders.filter((o) =>
    ['delivered', 'completed'].includes(o.status)
  );

  const spent = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="dashboard-layout">
      <Navbar variant="student" />
      <main className="page student-dash">
        <header className="dash-header">
          <div>
            <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="dash-header__sub">
              Order online — get food at your hostel room for ₹{DELIVERY_FEE} or pick up free at the counter.
            </p>
          </div>
          <Link to="/menu" className="btn btn--primary">
            Order online
          </Link>
        </header>

        <div className="grid-3 student-dash__stats">
          <div className="card stat-card">
            <div className="stat-card__value">{itemCount}</div>
            <div className="stat-card__label">Items in cart</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__value">{myOrders.length}</div>
            <div className="stat-card__label">Your online orders</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__value">₹{spent}</div>
            <div className="stat-card__label">Total spent</div>
          </div>
        </div>

        <section className="student-dash__quick card">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            <Link to="/menu" className="quick-action quick-action--primary">
              <span>📱</span>
              <span>Order online</span>
            </Link>
            <Link to="/cart" className="quick-action">
              <span>🛒</span>
              <span>Checkout ({itemCount})</span>
            </Link>
          </div>
        </section>

        {activeOrder && (
          <section className="student-dash__active card student-dash__active--live">
            <h3>Active order — {activeOrder.id}</h3>
            <p>{activeOrder.items}</p>
            {activeOrder.deliveryType === 'room' ? (
              <p className="student-dash__active-loc">
                🏠 Delivering to Room {activeOrder.room}, {activeOrder.block}
              </p>
            ) : (
              <p className="student-dash__active-loc">🏬 Counter pickup</p>
            )}
            <StatusBadge status={activeOrder.status} deliveryType={activeOrder.deliveryType} />
          </section>
        )}

        <section className="student-dash__orders">
          <h2>Your orders</h2>
          {myOrders.length === 0 ? (
            <div className="empty-state card">
              <p>No online orders yet. <Link to="/menu">Place your first order →</Link></p>
            </div>
          ) : (
            <div className="orders-table card">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.id}</strong></td>
                      <td>
                        {order.deliveryType === 'room'
                          ? `Room ${order.room}`
                          : 'Pickup'}
                      </td>
                      <td>₹{order.total}</td>
                      <td>
                        <StatusBadge status={order.status} deliveryType={order.deliveryType} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {pastOrders.length > 0 && (
          <p className="student-dash__past-note">
            {pastOrders.length} completed order{pastOrders.length !== 1 ? 's' : ''} in your history.
          </p>
        )}
      </main>
      <Footer variant="minimal" />
    </div>
  );
}
