import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { registerUser } from '../utils/platformStats';

const AuthContext = createContext(null);

const DEMO_USERS = {
  student: { email: 'student@campus.edu', password: 'student123', role: 'student', name: 'Alex Student' },
  admin: { email: 'admin@campus.edu', password: 'admin123', role: 'admin', name: 'Sam Admin' },
  helper: { email: 'helper@campus.edu', password: 'helper123', role: 'helper', name: 'Jordan Helper' },
};

export function AuthProvider({ children }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('canteen_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const getStoredRoles = useCallback(() => {
    try {
      const raw = localStorage.getItem('canteen_user_roles');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const setStoredRole = useCallback(
    (uid, role) => {
      const current = getStoredRoles();
      current[uid] = role;
      localStorage.setItem('canteen_user_roles', JSON.stringify(current));
    },
    [getStoredRoles]
  );

  const mapFirebaseUserToSession = useCallback(
    (firebaseUser) => {
      if (!firebaseUser) return null;
      const demoMatch = Object.values(DEMO_USERS).find(
        (u) => u.email === firebaseUser.email
      );
      const roleMap = getStoredRoles();
      const role = demoMatch?.role || roleMap[firebaseUser.uid] || 'student';
      const name =
        firebaseUser.displayName ||
        demoMatch?.name ||
        firebaseUser.email?.split('@')[0] ||
        'User';
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role,
        name,
      };
    },
    [getStoredRoles]
  );

  const login = useCallback(async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );
      const session = mapFirebaseUserToSession(credential.user);
      if (!session) {
        return { ok: false, error: 'Unable to load account session.' };
      }
      setStoredRole(credential.user.uid, session.role);
      setUser(session);
      localStorage.setItem('canteen_user', JSON.stringify(session));
      await registerUser(session.email, session.role);
      return { ok: true, role: session.role };
    } catch (err) {
      return { ok: false, error: err?.message || 'Login failed' };
    }
  }, [mapFirebaseUserToSession, setStoredRole]);

  const signup = useCallback(async ({ email, password, role, name }) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );
      if (name?.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() });
      }
      setStoredRole(credential.user.uid, role);
      const session = {
        uid: credential.user.uid,
        email: credential.user.email,
        role,
        name: name?.trim() || credential.user.email?.split('@')[0] || 'User',
      };
      setUser(session);
      localStorage.setItem('canteen_user', JSON.stringify(session));
      await registerUser(session.email, session.role);
      return { ok: true, role: session.role };
    } catch (err) {
      return { ok: false, error: err?.message || 'Account creation failed' };
    }
  }, [setStoredRole]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } finally {
      setUser(null);
      localStorage.removeItem('canteen_user');
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const session = mapFirebaseUserToSession(firebaseUser);
        setUser(session);
        if (session) {
          localStorage.setItem('canteen_user', JSON.stringify(session));
          void registerUser(session.email, session.role);
        }
      } else {
        setUser(null);
        localStorage.removeItem('canteen_user');
      }
      setIsAuthLoading(false);
    });
    return () => unsub();
  }, [mapFirebaseUserToSession]);

  useEffect(() => {
    if (user?.email && user?.role) {
      void registerUser(user.email, user.role);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoggedIn: !!user,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getDashboardPath(role) {
  if (role === 'admin') return '/admin';
  if (role === 'helper') return '/helper';
  return '/student';
}
