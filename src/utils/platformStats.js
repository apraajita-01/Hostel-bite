import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const USERS_KEY = 'canteen_registered_users';
const ORDERS_KEY = 'canteen_orders';
export const CART_KEY = 'canteen_cart';
export const MENU_KEY = 'canteen_menu';

export const DELIVERY_FEE = 10;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function registerUser(email, role) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return loadRegisteredUsers();

  const users = loadRegisteredUsers();
  const exists = users.some((u) => normalizeEmail(u.email) === normalizedEmail);
  const updated = exists
    ? users
    : [...users, { email: normalizedEmail, role, joinedAt: new Date().toISOString() }];

  localStorage.setItem(USERS_KEY, JSON.stringify(updated));

  try {
    await setDoc(
      doc(db, 'registeredUsers', normalizedEmail),
      {
        email: normalizedEmail,
        role,
        joinedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Firestore user sync failed:', error);
  }

  return updated;
}

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveOrders(orders) {
  if (!Array.isArray(orders)) return;

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  try {
    await Promise.all(
      orders.map((order) =>
        setDoc(
          doc(db, 'orders', String(order.id)),
          {
            ...order,
            studentEmail: normalizeEmail(order.studentEmail || order.student?.email || ''),
            createdAt: order.createdAt ?? Date.now(),
          },
          { merge: true }
        )
      )
    );
  } catch (error) {
    console.warn('Firestore order sync failed:', error);
  }
}

export function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getPlatformStats() {
  const users = loadRegisteredUsers();
  const orders = loadOrders() || [];
  const students = users.filter((u) => u.role === 'student').length;
  const helpers = users.filter((u) => u.role === 'helper').length;
  const deliveries = orders.filter(
    (o) => o.deliveryType === 'room' && o.status === 'delivered'
  ).length;
  const onlineOrders = orders.filter((o) => o.source === 'online').length;

  return {
    totalUsers: users.length,
    students,
    helpers,
    totalOrders: orders.length,
    onlineOrders,
    roomDeliveries: deliveries,
    activeDeliveries: orders.filter(
      (o) => o.deliveryType === 'room' && !['delivered', 'completed'].includes(o.status)
    ).length,
  };
}
