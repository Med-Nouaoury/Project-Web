import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/catalogue?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="navbar-lg navbar navbar-expand-lg" aria-label="Navigation principale">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-book-half me-2" style={{ color: 'var(--terracotta)' }}></i>
          LivresGourmands
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Ouvrir le menu"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* Search */}
          <form className="d-flex mx-auto" style={{ maxWidth: 340 }} onSubmit={handleSearch} role="search">
            <div className="input-group">
              <input
                className="form-control"
                style={{ borderRadius: '50px 0 0 50px', border: '1.5px solid var(--border)', fontSize: '.87rem' }}
                type="search"
                placeholder="Rechercher un livre, auteur…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Recherche dans le catalogue"
              />
              <button
                className="btn btn-terra"
                style={{ borderRadius: '0 50px 50px 0', padding: '.5rem .9rem' }}
                type="submit"
                aria-label="Lancer la recherche"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Nav links */}
          <ul className="navbar-nav align-items-center gap-1 ms-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Accueil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalogue">Catalogue</NavLink>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link
                className="nav-link cart-btn d-flex align-items-center gap-1"
                to="/panier"
                aria-label={`Panier — ${totalItems} article(s)`}
              >
                <i className="bi bi-bag fs-5"></i>
                {totalItems > 0 && (
                  <span className="cart-badge" aria-hidden="true">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
                <span className="d-none d-lg-inline ms-1" style={{ fontSize: '.85rem', fontWeight: 600 }}>
                  Panier
                </span>
              </Link>
            </li>

            {/* Auth */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center gap-1 border-0 bg-transparent"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span className="d-none d-lg-inline" style={{ fontSize: '.85rem', fontWeight: 600 }}>
                    {user.prenom || user.nom}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  style={{ borderRadius: 12, border: '1px solid var(--border)', minWidth: 180 }}
                >
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        <i className="bi bi-speedometer2 me-2"></i>Dashboard Admin
                      </Link>
                    </li>
                  )}
                  {isAdmin && <li><hr className="dropdown-divider" /></li>}
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => { logout(); navigate('/'); }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item d-flex gap-2 align-items-center">
                <Link className="nav-link" to="/login" style={{ fontWeight: 600, fontSize: '.88rem' }}>
                  Connexion
                </Link>
                <Link className="btn btn-terra btn-sm" to="/register">
                  <i className="bi bi-person-plus me-1"></i>S'inscrire
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
