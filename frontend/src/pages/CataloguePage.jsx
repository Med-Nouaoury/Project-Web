import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOuvrages } from '../services/api';
import BookCard from '../components/BookCard';
import ToastContainer, { useToast } from '../components/Toast';

const MOCK_BOOKS = [
  { id: 1, titre: 'Le Grand Livre de la Pâtisserie Française', auteur: 'Pierre Hermé', prix: 49.99, categorie: 'Pâtisserie', stock: 12, note_moyenne: 4.8, image_url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=550&fit=crop' },
  { id: 2, titre: 'Gastronomie Moléculaire', auteur: 'Ferran Adrià', prix: 62.00, categorie: 'Gastronomie', stock: 5, note_moyenne: 4.6, image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=550&fit=crop' },
  { id: 3, titre: 'Saveurs du Maroc', auteur: 'Paula Wolfert', prix: 38.50, categorie: 'Cuisine du monde', stock: 0, note_moyenne: 4.9, image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=550&fit=crop' },
  { id: 4, titre: "L'Art du Pain Artisan", auteur: 'Chad Robertson', prix: 44.95, categorie: 'Boulangerie', stock: 8, note_moyenne: 4.7, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=550&fit=crop' },
  { id: 5, titre: 'Cuisine Végétarienne du Monde', auteur: 'Yotam Ottolenghi', prix: 41.00, categorie: 'Végétarien', stock: 15, note_moyenne: 4.5, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=550&fit=crop' },
  { id: 6, titre: 'Encyclopédie des Vins', auteur: 'Jancis Robinson', prix: 89.99, categorie: 'Vins', stock: 3, note_moyenne: 4.8, image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=550&fit=crop' },
  { id: 7, titre: 'Sushi — Maîtrise et Tradition', auteur: 'Nobu Matsuhisa', prix: 55.00, categorie: 'Cuisine du monde', stock: 6, note_moyenne: 4.4, image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=550&fit=crop' },
  { id: 8, titre: 'Confiserie & Chocolaterie', auteur: 'Christophe Michalak', prix: 35.90, categorie: 'Pâtisserie', stock: 9, note_moyenne: 4.3, image_url: 'https://images.unsplash.com/photo-1481390088058-2edb34d2b9c5?w=400&h=550&fit=crop' },
  { id: 9, titre: 'Cuisine Italienne Authentique', auteur: 'Marcella Hazan', prix: 47.50, categorie: 'Cuisine du monde', stock: 11, note_moyenne: 4.7, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=550&fit=crop' },
  { id: 10, titre: 'Les Grandes Sauces Françaises', auteur: 'Michel Roux', prix: 32.00, categorie: 'Gastronomie', stock: 7, note_moyenne: 4.2, image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=550&fit=crop' },
  { id: 11, titre: 'Street Food du Monde', auteur: 'Anthony Bourdain', prix: 39.99, categorie: 'Cuisine du monde', stock: 4, note_moyenne: 4.6, image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=550&fit=crop' },
  { id: 12, titre: 'Fermentation & Lacto', auteur: 'Sandor Katz', prix: 52.00, categorie: 'Gastronomie', stock: 2, note_moyenne: 4.5, image_url: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=550&fit=crop' },
];

const CATS = ['Tous', 'Gastronomie', 'Pâtisserie', 'Végétarien', 'Cuisine du monde', 'Boulangerie', 'Vins'];

const SORT_OPTIONS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'prix_asc', label: 'Prix : croissant' },
  { value: 'prix_desc', label: 'Prix : décroissant' },
  { value: 'note', label: 'Mieux notés' },
  { value: 'titre', label: 'A → Z' },
  { value: 'nouveaute', label: 'Nouveautés' },
];

const VIEW_MODES = ['grid', 'list'];

export default function CataloguePage() {
  const { toasts, showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state — initialized from URL params
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'Tous');
  const [sort, setSort] = useState('default');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(150);
  const [stockOnly, setStockOnly] = useState(false);
  const [searchQ, setSearchQ] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
const imgSrc = (url) => url?.startsWith('http') ? url : `https://livregourmands-app.onrender.com${url}`
  // Fetch all books once
  useEffect(() => {
    setLoading(true);
    getOuvrages()
      .then((res) => setBooks(res.data?.ouvrages || res.data || []))
      .catch(() => setBooks(MOCK_BOOKS))
      .finally(() => setLoading(false));
  }, []);

  // Sync cat from URL
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCat(cat);
    const q = searchParams.get('q');
    if (q) setSearchQ(q);
  }, [searchParams]);

  // Filter + Sort logic
  const filtered = books
    .filter((b) => {
      const matchCat = activeCat === 'Tous' || b.categorie === activeCat;
      const price = parseFloat(b.prix);
      const matchPrice = price >= priceMin && price <= priceMax;
      const matchStock = !stockOnly || (b.stock ?? b.quantite_stock ?? 0) > 0;
      const matchSearch =
        !searchQ.trim() ||
        b.titre?.toLowerCase().includes(searchQ.toLowerCase()) ||
        b.auteur?.toLowerCase().includes(searchQ.toLowerCase()) ||
        b.categorie?.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchPrice && matchStock && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'prix_asc') return parseFloat(a.prix) - parseFloat(b.prix);
      if (sort === 'prix_desc') return parseFloat(b.prix) - parseFloat(a.prix);
      if (sort === 'note') return parseFloat(b.note_moyenne || 0) - parseFloat(a.note_moyenne || 0);
      if (sort === 'titre') return a.titre.localeCompare(b.titre, 'fr');
      if (sort === 'nouveaute') return b.id - a.id;
      return 0;
    });

  const handleCatClick = (cat) => {
    setActiveCat(cat);
    setSearchParams(cat !== 'Tous' ? { cat } : {});
  };

  const resetFilters = () => {
    setActiveCat('Tous');
    setSort('default');
    setPriceMin(0);
    setPriceMax(150);
    setStockOnly(false);
    setSearchQ('');
    setSearchParams({});
  };

  const hasActiveFilters =
    activeCat !== 'Tous' || sort !== 'default' || priceMin > 0 || priceMax < 150 || stockOnly || searchQ;

  return (
    <>
      {/* ── Page header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--espresso) 0%, #3d2412 100%)',
          padding: '2.5rem 0',
          color: '#fff',
        }}
      >
        <div className="container">
          <nav aria-label="Fil d'Ariane" className="mb-2">
            <ol className="breadcrumb mb-0" style={{ fontSize: '.8rem' }}>
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: 'rgba(255,255,255,.55)' }}>Accueil</Link>
              </li>
              <li className="breadcrumb-item active" style={{ color: 'rgba(255,255,255,.85)' }}>
                Catalogue
              </li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 900, margin: 0 }}>
            {activeCat === 'Tous' ? 'Tout le catalogue' : activeCat}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '.88rem', marginTop: '.3rem' }}>
            {books.length} ouvrage{books.length !== 1 ? 's' : ''} disponibles
          </p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* ══════════════════════════════════════
              SIDEBAR FILTERS (desktop)
          ══════════════════════════════════════ */}
          <div className="col-lg-3 d-none d-lg-block">
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                position: 'sticky',
                top: 80,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                  <i className="bi bi-funnel me-2" style={{ color: 'var(--terracotta)' }}></i>
                  Filtres
                </h3>
                {hasActiveFilters && (
                  <button
                    className="btn btn-link p-0"
                    style={{ fontSize: '.78rem', color: 'var(--terracotta)', textDecoration: 'none', fontWeight: 600 }}
                    onClick={resetFilters}
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Catégorie */}
              <div className="mb-4">
                <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: '.6rem' }}>
                  Catégorie
                </div>
                {CATS.map((cat) => (
                  <button
                    key={cat}
                    className="d-flex align-items-center justify-content-between w-100"
                    onClick={() => handleCatClick(cat)}
                    aria-pressed={activeCat === cat}
                    style={{
                      background: activeCat === cat ? 'rgba(196,89,58,.08)' : 'none',
                      border: 'none',
                      borderRadius: 8,
                      padding: '.45rem .7rem',
                      fontSize: '.88rem',
                      fontWeight: activeCat === cat ? 700 : 500,
                      color: activeCat === cat ? 'var(--terracotta)' : 'var(--charcoal)',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'all .15s',
                    }}
                  >
                    <span>{cat}</span>
                    {activeCat === cat && <i className="bi bi-check2" style={{ fontSize: '.85rem' }}></i>}
                  </button>
                ))}
              </div>

              {/* Prix */}
              <div className="mb-4">
                <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: '.8rem' }}>
                  Prix (CAD)
                </div>
                <div className="d-flex gap-2 mb-2">
                  <div style={{ flex: 1 }}>
                    <label htmlFor="price-min-side" style={{ fontSize: '.72rem', color: 'var(--muted)', fontWeight: 600 }}>Min</label>
                    <input
                      id="price-min-side"
                      type="number"
                      className="form-control form-control-sm"
                      value={priceMin}
                      min={0}
                      max={priceMax}
                      onChange={(e) => setPriceMin(Math.max(0, Number(e.target.value)))}
                      style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '.85rem' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="price-max-side" style={{ fontSize: '.72rem', color: 'var(--muted)', fontWeight: 600 }}>Max</label>
                    <input
                      id="price-max-side"
                      type="number"
                      className="form-control form-control-sm"
                      value={priceMax}
                      min={priceMin}
                      max={500}
                      onChange={(e) => setPriceMax(Math.min(500, Number(e.target.value)))}
                      style={{ borderRadius: 8, borderColor: 'var(--border)', fontSize: '.85rem' }}
                    />
                  </div>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min={0}
                  max={150}
                  step={5}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  style={{ accentColor: 'var(--terracotta)' }}
                  aria-label={`Prix max : ${priceMax} $`}
                />
                <div style={{ fontSize: '.75rem', color: 'var(--muted)', textAlign: 'right' }}>
                  Jusqu'à <strong style={{ color: 'var(--terracotta)' }}>{priceMax} $</strong>
                </div>
              </div>

              {/* En stock seulement */}
              <div>
                <div style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: '.6rem' }}>
                  Disponibilité
                </div>
                <div className="form-check" style={{ fontSize: '.88rem' }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="stock-only"
                    checked={stockOnly}
                    onChange={(e) => setStockOnly(e.target.checked)}
                    style={{ accentColor: 'var(--terracotta)' }}
                  />
                  <label className="form-check-label" htmlFor="stock-only" style={{ fontWeight: stockOnly ? 600 : 400, cursor: 'pointer' }}>
                    En stock uniquement
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════
              MAIN — search bar + sort + grid
          ══════════════════════════════════════ */}
          <div className="col-lg-9">
            {/* Top bar */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              {/* Search input */}
              <div className="flex-grow-1" style={{ minWidth: 200 }}>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: '10px 0 0 10px' }}
                  >
                    <i className="bi bi-search" style={{ color: 'var(--muted)' }}></i>
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Titre, auteur, catégorie…"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    style={{ border: '1.5px solid var(--border)', borderLeft: 'none', borderRadius: '0 10px 10px 0', fontSize: '.9rem' }}
                    aria-label="Rechercher dans le catalogue"
                  />
                  {searchQ && (
                    <button
                      className="btn"
                      style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'none', border: 'none', color: 'var(--muted)', padding: 0 }}
                      onClick={() => setSearchQ('')}
                      aria-label="Effacer la recherche"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ width: 'auto', borderRadius: 10, borderColor: 'var(--border)', fontSize: '.88rem' }}
                aria-label="Trier les résultats"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* View mode toggle */}
              <div
                className="d-flex"
                style={{ border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}
                role="group"
                aria-label="Mode d'affichage"
              >
                {[['grid', 'bi-grid-3x3-gap'], ['list', 'bi-list-ul']].map(([mode, icon]) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    aria-label={mode === 'grid' ? 'Vue grille' : 'Vue liste'}
                    style={{
                      padding: '.45rem .65rem',
                      border: 'none',
                      background: viewMode === mode ? 'var(--terracotta)' : 'var(--card-bg)',
                      color: viewMode === mode ? '#fff' : 'var(--muted)',
                      cursor: 'pointer',
                      transition: 'all .15s',
                    }}
                  >
                    <i className={`bi ${icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile category chips */}
            <div className="d-flex d-lg-none flex-wrap gap-2 mb-3" role="group" aria-label="Catégories">
              {CATS.map((cat) => (
                <button
                  key={cat}
                  className={`cat-chip ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => handleCatClick(cat)}
                  aria-pressed={activeCat === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Active filters tags */}
            {hasActiveFilters && (
              <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
                <span style={{ fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600 }}>Filtres actifs :</span>
                {activeCat !== 'Tous' && (
                  <span className="badge" style={{ background: 'rgba(196,89,58,.1)', color: 'var(--terracotta)', borderRadius: 50, padding: '.35rem .75rem', fontSize: '.75rem', fontWeight: 700 }}>
                    {activeCat}
                    <button
                      onClick={() => handleCatClick('Tous')}
                      style={{ background: 'none', border: 'none', padding: '0 0 0 .4rem', color: 'inherit', cursor: 'pointer', fontSize: '.85rem' }}
                      aria-label={`Retirer le filtre ${activeCat}`}
                    >×</button>
                  </span>
                )}
                {stockOnly && (
                  <span className="badge" style={{ background: 'rgba(107,143,113,.1)', color: 'var(--sage)', borderRadius: 50, padding: '.35rem .75rem', fontSize: '.75rem', fontWeight: 700 }}>
                    En stock
                    <button onClick={() => setStockOnly(false)} style={{ background: 'none', border: 'none', padding: '0 0 0 .4rem', color: 'inherit', cursor: 'pointer' }} aria-label="Retirer filtre stock">×</button>
                  </span>
                )}
                {searchQ && (
                  <span className="badge" style={{ background: 'rgba(59,130,246,.1)', color: '#3b82f6', borderRadius: 50, padding: '.35rem .75rem', fontSize: '.75rem', fontWeight: 700 }}>
                    « {searchQ} »
                    <button onClick={() => setSearchQ('')} style={{ background: 'none', border: 'none', padding: '0 0 0 .4rem', color: 'inherit', cursor: 'pointer' }} aria-label="Effacer la recherche">×</button>
                  </span>
                )}
                <button
                  className="btn btn-link p-0"
                  style={{ fontSize: '.78rem', color: 'var(--muted)', textDecoration: 'underline' }}
                  onClick={resetFilters}
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Results count */}
            <p style={{ fontSize: '.83rem', color: 'var(--muted)', marginBottom: '1rem' }} aria-live="polite">
              {loading ? 'Chargement…' : `${filtered.length} résultat${filtered.length !== 1 ? 's' : ''}`}
            </p>

            {/* ── Loading ── */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border spinner-terra" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
                  <span className="visually-hidden">Chargement du catalogue…</span>
                </div>
                <p style={{ color: 'var(--muted)', marginTop: '1rem', fontSize: '.9rem' }}>Chargement du catalogue…</p>
              </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
              <div className="alert alert-custom alert-danger d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                <div>
                  <strong>Erreur de connexion.</strong> Impossible de charger les ouvrages.{' '}
                  <button className="btn btn-link p-0" style={{ color: 'inherit', fontWeight: 700 }} onClick={() => window.location.reload()}>
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search" style={{ fontSize: '3.5rem', color: 'var(--border)' }}></i>
                <h4 style={{ fontFamily: 'var(--font-display)', marginTop: '1rem', color: 'var(--espresso)' }}>
                  Aucun résultat
                </h4>
                <p style={{ color: 'var(--muted)' }}>
                  {searchQ
                    ? `Aucun livre ne correspond à « ${searchQ} ».`
                    : 'Essayez d\'ajuster vos filtres.'}
                </p>
                <button className="btn btn-outline-terra mt-2" onClick={resetFilters}>
                  <i className="bi bi-x-circle me-1"></i>Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* ── GRID VIEW ── */}
            {!loading && !error && filtered.length > 0 && viewMode === 'grid' && (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                {filtered.map((book) => (
                  <div className="col" key={book.id}>
                    <BookCard book={book} onToast={(msg) => showToast(msg, 'success')} />
                  </div>
                ))}
              </div>
            )}

            {/* ── LIST VIEW ── */}
            {!loading && !error && filtered.length > 0 && viewMode === 'list' && (
              <div role="list" aria-label="Liste des ouvrages">
                {filtered.map((book) => {
                  const outOfStock = (book.stock ?? book.quantite_stock ?? 0) <= 0;
                  return (
                    <div
                      key={book.id}
                      role="listitem"
                      style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '1rem',
                        marginBottom: '.75rem',
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        transition: 'box-shadow .2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                    >
                      {/* Image */}
                      <Link to={`/livre/${book.id}`} style={{ flexShrink: 0 }}>
                        <div style={{ width: 60, height: 80, borderRadius: 8, overflow: 'hidden', background: 'var(--cream)' }}>
                          {book.image_url ? (
                            <img src={imgSrc(book.image_url)} alt={book.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <i className="bi bi-book" style={{ color: 'var(--muted)' }}></i>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--terracotta)' }}>
                          {book.categorie}
                        </div>
                        <Link to={`/livre/${book.id}`} style={{ textDecoration: 'none' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--espresso)', fontSize: '.95rem', lineHeight: 1.3, marginTop: '.1rem' }}>
                            {book.titre}
                          </div>
                        </Link>
                        <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.15rem' }}>
                          {book.auteur}
                        </div>
                        {book.note_moyenne && (
                          <div style={{ fontSize: '.75rem', color: 'var(--saffron)', marginTop: '.2rem' }}>
                            {'★'.repeat(Math.round(book.note_moyenne))}
                            <span style={{ color: 'var(--muted)', marginLeft: '.3rem' }}>({parseFloat(book.note_moyenne).toFixed(1)})</span>
                          </div>
                        )}
                      </div>

                      {/* Price + action */}
                      <div className="text-end" style={{ flexShrink: 0 }}>
                        <div style={{ fontWeight: 800, color: 'var(--terracotta)', fontSize: '1.1rem' }}>
                          {parseFloat(book.prix).toFixed(2)} $
                        </div>
                        <div style={{ fontSize: '.72rem', color: outOfStock ? '#dc3545' : 'var(--sage)', fontWeight: 600, marginBottom: '.4rem' }}>
                          {outOfStock ? 'Épuisé' : `${book.stock ?? book.quantite_stock} en stock`}
                        </div>
                        <Link
                          to={`/livre/${book.id}`}
                          className="btn btn-terra btn-sm"
                          style={{ fontSize: '.78rem', padding: '.35rem .8rem' }}
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
