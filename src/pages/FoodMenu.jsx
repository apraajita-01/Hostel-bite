import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { MENU_CATEGORIES } from '../data/mockMenu';
import { useMenu } from '../context/MenuContext';
import './FoodMenu.css';

export default function FoodMenu() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { addItem, itemCount } = useCart();
  const { menu } = useMenu();

  const filtered = menu.filter((item) => {
    const matchCat = category === 'All' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="dashboard-layout">
      <Navbar variant="student" />
      <main className="page menu-page">
        <header className="menu-header">
          <div>
            <h1>Food menu</h1>
            <p className="menu-header__sub">Add items, then checkout with room delivery (₹10) or free pickup</p>
          </div>
          <Link to="/cart" className="btn btn--primary">
            Order online ({itemCount})
          </Link>
        </header>

        <div className="menu-toolbar">
          <input
            type="search"
            className="menu-search"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search menu"
          />
          <div className="menu-categories" role="tablist">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={category === cat}
                className={`menu-cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-grid">
          {filtered.length === 0 ? (
            <div className="empty-state card" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-state__icon">🔍</div>
              <p>No items match your search.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <article key={item.id} className={`menu-item card ${!item.available ? 'menu-item--soldout' : ''}`}>
                <div className="menu-item__emoji">{item.emoji}</div>
                <div className="menu-item__body">
                  <span className="menu-item__cat">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p className="menu-item__price">₹{item.price}</p>
                  {!item.available ? (
                    <span className="menu-item__soldout">Sold out</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--primary btn--sm menu-item__add"
                      onClick={() => addItem(item)}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
