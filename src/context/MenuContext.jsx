import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MENU_ITEMS } from '../data/mockMenu';
import { MENU_KEY, loadJson, saveJson } from '../utils/platformStats';

const MenuContext = createContext(null);

function loadMenu() {
  const stored = loadJson(MENU_KEY, null);
  if (!Array.isArray(stored)) return MENU_ITEMS;

  // Keep saved availability while allowing newly added default items to appear.
  const savedById = new Map(stored.map((item) => [item.id, item]));
  return MENU_ITEMS.map((item) => ({
    ...item,
    available: savedById.get(item.id)?.available ?? item.available,
  }));
}

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(loadMenu);

  useEffect(() => {
    saveJson(MENU_KEY, menu);
  }, [menu]);

  useEffect(() => {
    const syncMenu = (event) => {
      if (event.key !== MENU_KEY) return;
      const latest = loadMenu();
      setMenu((current) =>
        JSON.stringify(current) === JSON.stringify(latest) ? current : latest
      );
    };
    window.addEventListener('storage', syncMenu);
    return () => window.removeEventListener('storage', syncMenu);
  }, []);

  const toggleAvailability = useCallback((id) => {
    setMenu((current) =>
      current.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  }, []);

  return (
    <MenuContext.Provider value={{ menu, toggleAvailability }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within MenuProvider');
  return context;
}
