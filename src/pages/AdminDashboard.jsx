import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useOrders } from '../context/OrdersContext';
import { useMenu } from '../context/MenuContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { menu, toggleAvailability } = useMenu();
  const { orders, updateOrderStatus, getPackagingQueue } = useOrders();
  const packagingQueue = getPackagingQueue();
  const pickupReady = orders.filter(
    (o) => o.deliveryType === 'pickup' && o.status === 'packed'
  );

  const markPacked = (id) => updateOrderStatus(id, 'packed');
  const markPickupReady = (id) => updateOrderStatus(id, 'completed');

  const availableCount = menu.filter((i) => i.available).length;
  const onlineToday = orders.filter((o) => o.source === 'online').length;

  return (
    <div className="dashboard-layout">
      <Navbar variant="admin" />
      <main className="page page--wide admin-dash">
        <header className="dash-header">
          <div>
            <h1>Canteen dashboard</h1>
            <p className="dash-header__sub">Pack online orders and manage the menu</p>
          </div>
        </header>

        <div className="grid-3 admin-dash__stats">
          <div className="card stat-card">
            <div className="stat-card__value">{packagingQueue.length}</div>
            <div className="stat-card__label">Awaiting packaging</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__value">{onlineToday}</div>
            <div className="stat-card__label">Online orders (all)</div>
          </div>
          <div className="card stat-card">
            <div className="stat-card__value">{availableCount}/{menu.length}</div>
            <div className="stat-card__label">Menu items available</div>
          </div>
        </div>

        <section className="admin-section card admin-section--highlight">
          <div className="admin-section__head">
            <h2>📦 Online orders — packaging queue</h2>
            <span className="admin-queue-count">{packagingQueue.length} pending</span>
          </div>
          <p className="admin-section__desc">
            Students place these online. Pack the food, then mark packed — room orders go to helpers; pickup orders wait at counter.
          </p>

          {packagingQueue.length === 0 ? (
            <p className="admin-empty-queue">No orders waiting to pack. You&apos;re all caught up!</p>
          ) : (
            <div className="packaging-list">
              {packagingQueue.map((order) => (
                <article key={order.id} className="packaging-card">
                  <div className="packaging-card__head">
                    <strong>{order.id}</strong>
                    <span>{order.time}</span>
                  </div>
                  <p className="packaging-card__student">{order.student}</p>
                  <p className="packaging-card__items">{order.items}</p>
                  <div className="packaging-card__meta">
                    {order.deliveryType === 'room' ? (
                      <span className="packaging-card__tag packaging-card__tag--delivery">
                        🏠 Room {order.room}, {order.block} · +₹{order.deliveryFee} delivery
                      </span>
                    ) : (
                      <span className="packaging-card__tag">🏬 Counter pickup</span>
                    )}
                    <strong>₹{order.total}</strong>
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => markPacked(order.id)}
                  >
                    Mark packed
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {pickupReady.length > 0 && (
          <section className="admin-section card">
            <h2>Ready for counter pickup</h2>
            <ul className="pickup-ready-list">
              {pickupReady.map((order) => (
                <li key={order.id}>
                  <span>
                    <strong>{order.id}</strong> — {order.student} — {order.items}
                  </span>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    onClick={() => markPickupReady(order.id)}
                  >
                    Student collected
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="admin-section card">
          <div className="admin-section__head">
            <h2>Menu management</h2>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="admin-table__emoji">{item.emoji}</span>
                      {item.name}
                    </td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <span className={`badge ${item.available ? 'badge--ready' : 'badge--completed'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.available ? 'Mark unavailable' : 'Mark available'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer variant="minimal" />
    </div>
  );
}
