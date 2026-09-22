import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useMenu } from '../context/MenuContext';
import './Cart.css';

const HOSTEL_BLOCKS = [
  'Girls Hostel A',
  'Girls Hostel B',
  'Boys Hostel A',
  'Boys Hostel B',
  'PG Block',
];

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder, DELIVERY_FEE } = useOrders();
  const { menu } = useMenu();
  const [placed, setPlaced] = useState(null);
  const [deliveryType, setDeliveryType] = useState('room');
  const [room, setRoom] = useState('');
  const [block, setBlock] = useState(HOSTEL_BLOCKS[0]);
  const [formError, setFormError] = useState('');

  const deliveryFee = deliveryType === 'room' ? DELIVERY_FEE : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    setFormError('');

    const unavailableItem = items.find(
      (item) => !menu.find((menuItem) => menuItem.id === item.id)?.available
    );
    if (unavailableItem) {
      setFormError(`${unavailableItem.name} is currently unavailable. Remove it to continue.`);
      return;
    }

    if (deliveryType === 'room') {
      if (!room.trim()) {
        setFormError('Enter your room number for delivery.');
        return;
      }
    }

    try {
      const order = placeOrder({
        cartItems: items,
        student: user,
        deliveryType,
        room: room.trim(),
        block,
      });
      setPlaced(order);
      clearCart();
    } catch (error) {
      setFormError(error.message || 'Unable to place this order.');
    }
  };

  if (placed) {
    return (
      <div className="dashboard-layout">
        <Navbar variant="student" />
        <main className="page cart-page">
          <div className="cart-success card">
            <span className="cart-success__icon">✅</span>
            <h1>Online order placed!</h1>
            <p>
              Order <strong>{placed.id}</strong> is with the canteen for packaging.
              {placed.deliveryType === 'room' ? (
                <> A helper will deliver to <strong>Room {placed.room}, {placed.block}</strong> (₹{DELIVERY_FEE} delivery fee).</>
              ) : (
                <> Pick up at the counter when status shows ready.</>
              )}
            </p>
            <div className="cart-success__actions">
              <Link to="/student" className="btn btn--primary">
                Track on dashboard
              </Link>
              <Link to="/menu" className="btn btn--secondary">
                Order more
              </Link>
            </div>
          </div>
        </main>
        <Footer variant="minimal" />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar variant="student" />
      <main className="page cart-page">
        <header className="cart-header">
          <div>
            <h1>Order online</h1>
            <p className="cart-header__sub">Checkout — room delivery or counter pickup</p>
          </div>
          <Link to="/menu" className="btn btn--secondary btn--sm">
            ← Add more items
          </Link>
        </header>

        {items.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state__icon">🛒</div>
            <p>Your cart is empty. Start an online order from the menu.</p>
            <Link to="/menu" className="btn btn--primary" style={{ marginTop: '1rem' }}>
              Browse menu
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-main">
              <ul className="cart-list card">
                {items.map((item) => (
                  <li key={item.id} className="cart-line">
                    <span className="cart-line__emoji">{item.emoji}</span>
                    <div className="cart-line__info">
                      <strong>{item.name}</strong>
                      <span>₹{item.price} each</span>
                    </div>
                    <div className="cart-line__qty">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-line__subtotal">₹{item.price * item.quantity}</span>
                    <button
                      type="button"
                      className="cart-line__remove"
                      aria-label="Remove item"
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <section className="cart-delivery card">
                <h2>Delivery option</h2>
                <div className="delivery-options">
                  <label className={`delivery-option ${deliveryType === 'room' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="room"
                      checked={deliveryType === 'room'}
                      onChange={() => setDeliveryType('room')}
                    />
                    <span className="delivery-option__icon">🏠</span>
                    <span className="delivery-option__text">
                      <strong>Room delivery</strong>
                      <span>Student helper delivers to your room · ₹{DELIVERY_FEE}</span>
                    </span>
                  </label>
                  <label className={`delivery-option ${deliveryType === 'pickup' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                    />
                    <span className="delivery-option__icon">🏬</span>
                    <span className="delivery-option__text">
                      <strong>Counter pickup</strong>
                      <span>Collect from canteen when ready · Free</span>
                    </span>
                  </label>
                </div>

                {deliveryType === 'room' && (
                  <div className="delivery-form">
                    <div className="form-group">
                      <label htmlFor="block">Hostel / block</label>
                      <select
                        id="block"
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                      >
                        {HOSTEL_BLOCKS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="room">Room number</label>
                      <input
                        id="room"
                        type="text"
                        placeholder="e.g. 214"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>

            <aside className="cart-summary card">
              <h2>Order summary</h2>
              <div className="cart-summary__row">
                <span>Food subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="cart-summary__row cart-summary__row--muted">
                <span>Delivery</span>
                <span>{deliveryFee ? `₹${deliveryFee}` : 'Free'}</span>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <strong>₹{grandTotal}</strong>
              </div>
              {formError && <p className="cart-summary__error" role="alert">{formError}</p>}
              <button
                type="button"
                className="btn btn--primary cart-summary__place"
                onClick={handlePlaceOrder}
              >
                Place online order
              </button>
              <p className="cart-summary__note">
                Canteen will pack your order · Helpers earn ₹{DELIVERY_FEE} per room delivery
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer variant="minimal" />
    </div>
  );
}
