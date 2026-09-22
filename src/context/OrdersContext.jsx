import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  loadOrders,
  saveOrders,
  DELIVERY_FEE,
  getPlatformStats,
} from '../utils/platformStats';

const OrdersContext = createContext(null);

const SEED_ORDERS = [
  {
    id: 'ORD-1042',
    student: 'Priya K.',
    studentEmail: 'priya@campus.edu',
    items: 'Veg Thali × 1, Masala Chai × 2',
    itemsDetail: [],
    subtotal: 100,
    deliveryFee: 10,
    total: 110,
    deliveryType: 'room',
    room: '214',
    block: 'Girls Hostel A',
    status: 'packed',
    source: 'online',
    time: '12:34 PM',
    createdAt: Date.now() - 600000,
  },
  {
    id: 'ORD-1041',
    student: 'Rahul M.',
    studentEmail: 'rahul@campus.edu',
    items: 'Chicken Biryani × 1',
    itemsDetail: [],
    subtotal: 120,
    deliveryFee: 10,
    total: 130,
    deliveryType: 'room',
    room: '108',
    block: 'Boys Hostel B',
    status: 'out_for_delivery',
    source: 'online',
    time: '12:28 PM',
    createdAt: Date.now() - 900000,
  },
  {
    id: 'ORD-1040',
    student: 'Alex Student',
    studentEmail: 'student@campus.edu',
    items: 'Masala Dosa × 2',
    itemsDetail: [],
    subtotal: 90,
    deliveryFee: 0,
    total: 90,
    deliveryType: 'pickup',
    room: '',
    block: '',
    status: 'pending',
    source: 'online',
    time: '12:25 PM',
    createdAt: Date.now() - 1200000,
  },
];

function initOrders() {
  const saved = loadOrders();
  if (saved && saved.length > 0) return saved;
  saveOrders(SEED_ORDERS);
  return SEED_ORDERS;
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatItemsSummary(cartItems) {
  return cartItems.map((i) => `${i.name} × ${i.quantity}`).join(', ');
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(initOrders);
  const [stats, setStats] = useState(getPlatformStats);

  const refreshStats = useCallback(() => {
    setStats(getPlatformStats());
  }, []);

  useEffect(() => {
    saveOrders(orders);
    refreshStats();
  }, [orders, refreshStats]);

  useEffect(() => {
    const syncOrders = (event) => {
      if (event.key !== 'canteen_orders') return;
      const latest = loadOrders();
      if (Array.isArray(latest)) {
        setOrders((current) =>
          JSON.stringify(current) === JSON.stringify(latest) ? current : latest
        );
      }
      refreshStats();
    };
    window.addEventListener('storage', syncOrders);
    return () => window.removeEventListener('storage', syncOrders);
  }, [refreshStats]);

  const placeOrder = useCallback(
    ({ cartItems, student, deliveryType, room, block }) => {
      const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const deliveryFee = deliveryType === 'room' ? DELIVERY_FEE : 0;
      if (!student?.email || !student?.name || !Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('A signed-in student and at least one cart item are required.');
      }
      if (!['room', 'pickup'].includes(deliveryType)) {
        throw new Error('Choose a valid delivery option.');
      }
      if (deliveryType === 'room' && (!room?.trim() || !block?.trim())) {
        throw new Error('Room and hostel block are required for delivery.');
      }
      const id = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const order = {
        id,
        student: student.name,
        studentEmail: student.email,
        items: formatItemsSummary(cartItems),
        itemsDetail: cartItems.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        deliveryType,
        room: deliveryType === 'room' ? room : '',
        block: deliveryType === 'room' ? block : '',
        status: 'pending',
        source: 'online',
        time: formatTime(),
        createdAt: Date.now(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    []
  );

  const updateOrderStatus = useCallback((id, status) => {
    const allowed = {
      pending: ['packed'],
      packed: ['out_for_delivery', 'completed'],
      out_for_delivery: ['delivered'],
    };
    setOrders((prev) => prev.map((order) => {
      if (order.id !== id) return order;
      return allowed[order.status]?.includes(status) ? { ...order, status } : order;
    }));
  }, []);

  const getStudentOrders = useCallback(
    (email) => orders.filter((o) => o.studentEmail === email),
    [orders]
  );

  const getPackagingQueue = useCallback(
    () => orders.filter((o) => o.source === 'online' && o.status === 'pending'),
    [orders]
  );

  const getDeliveryQueue = useCallback(
    () =>
      orders.filter(
        (o) =>
          o.deliveryType === 'room' &&
          ['packed', 'out_for_delivery'].includes(o.status)
      ),
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        stats,
        refreshStats,
        placeOrder,
        updateOrderStatus,
        getStudentOrders,
        getPackagingQueue,
        getDeliveryQueue,
        DELIVERY_FEE,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
