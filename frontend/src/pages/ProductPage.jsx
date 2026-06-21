import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOuvrage, getAvis, postAvis } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ToastContainer, { useToast } from '../components/Toast';

const MOCK = {
  id: 1, titre: 'Le Grand Livre de la Pâtisserie Française', auteur: 'Pierre Hermé',
  prix: 49.99, categorie: 'Pâtisserie', stock: 12, note_moyenne: 4.8,
  image_url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=600&h=800&fit=crop',
  description: `Un ouvrage de référence incontournable pour tout passionné de pâtisserie française. Pierre Hermé partage ici des décennies de savoir-faire, depuis les bases fondamentales jusqu'aux créations les plus sophistiquées.\n\nAvec plus de 250 recettes illustrées étape par étape, ce livre vous guide dans l'art de la pâte feuilletée, de la crème pâtissière, des macarons, des entremets et de bien d'autres classiques revisités avec talent.\n\nChaque recette est accompagnée de conseils techniques précis, de variantes créatives et de notes sur le choix des ingrédients de qualité.`,
  editeur: 'Éditions de La Martinière', annee: 2022, pages: 384, isbn: '978-2-7324-8745-1',
  langue: 'Français',
};

const MOCK_AVIS = [
  { id: 1, nom: 'Marie-Hélène', note: 5, commentaire: 'Absolument magnifique ! Les recettes sont précises et les photos sublimes. Un must-have pour tout amateur de pâtisserie.', date: '2024-03-15' },
  { id: 2, nom: 'Jean-Paul', note: 4, commentaire: 'Très bel ouvrage, les explications sont claires. Quelques recettes avancées demandent de l\'expérience, mais c\'est enrichissant.', date: '2024-02-28' },
  { id: 3, nom: 'Isabelle', note: 5, commentaire: 'Je le recommande vivement à toutes les personnes qui souhaitent progresser en pâtisserie. Un investissement qui vaut vraiment la peine.', date: '2024-01-10' },
];

function Stars({ note, size = '1rem' }) {
  return (
    <span aria-label={`Note : ${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i
          key={i}
          className={`bi bi-star${i <= note ? '-fill' : ''}`}
          style={{ color: i <= note ? 'var(--saffron)' : 'var(--border)', fontSize: size }}
        ></i>
      ))}
    </span>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const { user } = useAuth();
  const { toasts, showToast } = useToast();

  const [book, setBook] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addingCart, setAddingCart] = useState(false);
  const [reviewForm, setReviewForm] = useState({ note: 5, commentaire: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('desc');
const imgSrc = (url) => url?.startsWith('http') ? url : `https://livregourmands-app.onrender.com${url}`
  const inCart = items.find((i) => i.id === book?.id);
  const stock = book?.stock ?? book?.quantite_stock ?? 0;
  const outOfStock = stock <= 0;

  useEffect(() => {
    setLoading(true);
    Promise.all([getOuvrage(id), getAvis(id)])
      .then(([bookRes, avisRes]) => {
        setBook(bookRes.data);
        setAvis(avisRes.data || []);
      })
      .catch(() => {
        setBook(MOCK);
        setAvis(MOCK_AVIS);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (outOfStock) return;
    setAddingCart(true);
    addItem({
      id: book.id,
      titre: book.titre,
      prix: book.prix,
      image: book.image_url || book.image,
      stock,
    }, qty);
    showToast(`"${book.titre}" (×${qty}) ajouté au panier !`, 'success');
    setTimeout(() => setAddingCart(false), 700);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.commentaire.trim()) return;
    setSubmittingReview(true);
    try {
      await postAvis(id, reviewForm);
      setAvis((prev) => [{
        id: Date.now(), nom: user?.prenom || 'Vous',
        ...reviewForm, date: new Date().toISOString().split('T')[0],
      }, ...prev]);
      setReviewForm({ note: 5, commentaire: '' });
      showToast('Votre avis a été publié !', 'success');
    } catch {
      showToast('Impossible de publier votre avis. Réessayez plus tard.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border spinner-terra" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
            <span className="visually-hidden">Chargement…</span>
          </div>
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Chargement de l'ouvrage…</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-book-x" style={{ fontSize: '4rem', color: 'var(--border)' }}></i>
        <h3 style={{ fontFamily: 'var(--font-display)', marginTop: '1rem' }}>Ouvrage introuvable</h3>
        <Link to="/" className="btn btn-terra mt-3">Retour à l'accueil</Link>
      </div>
    );
  }

  const avgNote = avis.length > 0
    ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1)
    : book.note_moyenne;

  return (
    <>
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane">
          <ol className="breadcrumb" style={{ fontSize: '.82rem' }}>
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--terracotta)' }}>Accueil</Link></li>
            {book.categorie && <li className="breadcrumb-item" style={{ color: 'var(--muted)' }}>{book.categorie}</li>}
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--charcoal)' }}>
              {book.titre}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* ── Image ── */}
          <div className="col-lg-5">
            <div className="product-img-main" style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
              {book.image_url || book.image ? (
                <img
                  src={imgSrc(book.image_url) || book.image}
                  alt={book.titre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100" style={{ color: 'var(--muted)' }}>
                  <i className="bi bi-book" style={{ fontSize: '5rem' }}></i>
                </div>
              )}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="col-lg-7">
            {book.categorie && (
              <span style={{ fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--terracotta)' }}>
                <i className="bi bi-tag me-1"></i>{book.categorie}
              </span>
            )}

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: 'var(--espresso)', marginTop: '.4rem', lineHeight: 1.15 }}>
              {book.titre}
            </h1>

            <p style={{ color: 'var(--muted)', fontSize: '.95rem', marginTop: '.3rem' }}>
              <i className="bi bi-person me-1"></i>
              par <strong style={{ color: 'var(--charcoal)' }}>{book.auteur}</strong>
            </p>

            {/* Rating */}
            {avgNote && (
              <div className="d-flex align-items-center gap-2 mt-2">
                <Stars note={Math.round(avgNote)} />
                <span style={{ fontSize: '.88rem', fontWeight: 700, color: 'var(--charcoal)' }}>{avgNote}</span>
                <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>({avis.length} avis)</span>
              </div>
            )}

            {/* Price */}
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--terracotta)', marginTop: '1.2rem', fontFamily: 'var(--font-display)' }}>
              {parseFloat(book.prix).toFixed(2)} $
            </div>

            {/* Stock */}
            <div className="mt-2">
              {outOfStock ? (
                <span className="badge bg-danger" style={{ borderRadius: 8, fontSize: '.78rem' }}>
                  <i className="bi bi-x-circle me-1"></i>Stock épuisé
                </span>
              ) : stock <= 5 ? (
                <span className="badge bg-warning text-dark" style={{ borderRadius: 8, fontSize: '.78rem' }}>
                  <i className="bi bi-exclamation-circle me-1"></i>Plus que {stock} en stock — commandez vite !
                </span>
              ) : (
                <span className="badge bg-success" style={{ borderRadius: 8, fontSize: '.78rem' }}>
                  <i className="bi bi-check-circle me-1"></i>En stock ({stock} disponibles)
                </span>
              )}
            </div>

            <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-2" role="group" aria-label="Quantité">
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Diminuer la quantité"
                    disabled={qty <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: '1rem' }} aria-live="polite">
                    {qty}
                  </span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    aria-label="Augmenter la quantité"
                    disabled={qty >= stock}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <button
                  className="btn btn-terra flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={addingCart}
                  aria-label={`Ajouter ${qty} exemplaire(s) au panier`}
                  style={{ padding: '.7rem 1.5rem', fontSize: '1rem' }}
                >
                  {addingCart ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Ajout…</>
                  ) : inCart ? (
                    <><i className="bi bi-bag-check me-2"></i>Ajouter encore</>
                  ) : (
                    <><i className="bi bi-bag-plus me-2"></i>Ajouter au panier</>
                  )}
                </button>
              </div>
            )}

            {inCart && (
              <div className="alert alert-custom alert-success d-flex align-items-center gap-2 py-2" role="status">
                <i className="bi bi-bag-check-fill"></i>
                <span>Déjà dans votre panier ({inCart.qty} ex.) — <Link to="/panier" style={{ color: 'inherit', fontWeight: 700 }}>Voir le panier</Link></span>
              </div>
            )}

            {outOfStock && (
              <div className="alert alert-custom alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>Cet ouvrage est actuellement épuisé. Revenez bientôt !</span>
              </div>
            )}

            {/* Meta info */}
            <div className="row g-2 mt-3">
              {[
                book.editeur && ['bi-building', 'Éditeur', book.editeur],
                book.annee && ['bi-calendar3', 'Année', book.annee],
                book.pages && ['bi-file-text', 'Pages', `${book.pages} p.`],
                book.langue && ['bi-translate', 'Langue', book.langue],
              ].filter(Boolean).map(([icon, label, val]) => (
                <div key={label} className="col-6">
                  <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '.6rem .9rem', fontSize: '.82rem' }}>
                    <i className={`bi ${icon} me-1`} style={{ color: 'var(--terracotta)' }}></i>
                    <span style={{ color: 'var(--muted)' }}>{label} : </span>
                    <strong>{val}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs: Description / Avis ── */}
        <div className="mt-5">
          <div className="d-flex gap-1 border-bottom mb-4" role="tablist">
            {[['desc', 'Description'], ['avis', `Avis (${avis.length})`]].map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className="btn"
                onClick={() => setActiveTab(key)}
                style={{
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  padding: '.65rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '.9rem',
                  color: activeTab === key ? 'var(--terracotta)' : 'var(--muted)',
                  borderBottom: activeTab === key ? '2px solid var(--terracotta)' : '2px solid transparent',
                  background: 'none',
                  transition: 'all .18s',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Description */}
          {activeTab === 'desc' && (
            <div style={{ maxWidth: 720 }}>
              {book.description?.split('\n').map((p, i) => (
                <p key={i} style={{ lineHeight: 1.8, color: 'var(--charcoal)', marginBottom: '.8rem' }}>{p}</p>
              ))}
              {book.isbn && (
                <p style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
                  <strong>ISBN :</strong> {book.isbn}
                </p>
              )}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'avis' && (
            <div>
              {avis.length > 0 ? (
                <div style={{ maxWidth: 680 }}>
                  {avis.map((a) => (
                    <article key={a.id} className="review-card">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{a.nom || a.prenom || 'Anonyme'}</strong>
                          <div className="mt-1"><Stars note={a.note} size=".85rem" /></div>
                        </div>
                        <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>
                          {new Date(a.date || a.created_at).toLocaleDateString('fr-CA')}
                        </span>
                      </div>
                      <p style={{ marginTop: '.6rem', fontSize: '.9rem', lineHeight: 1.7, color: 'var(--charcoal)' }}>
                        {a.commentaire}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--muted)' }}>Aucun avis pour l'instant. Soyez le premier !</p>
              )}

              {/* Review form */}
              <div style={{ maxWidth: 580, marginTop: '2rem', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  Laisser un avis
                </h4>
                {!user && (
                  <div className="alert alert-custom alert-warning d-flex align-items-center gap-2 py-2 mb-3" role="note">
                    <i className="bi bi-info-circle-fill"></i>
                    <span><Link to="/login" style={{ color: 'inherit', fontWeight: 700 }}>Connectez-vous</Link> pour laisser un avis.</span>
                  </div>
                )}
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-3">
                    <label className="form-label fw-600" htmlFor="review-note" style={{ fontSize: '.88rem' }}>
                      Votre note
                    </label>
                    <div className="d-flex gap-2" id="review-note" role="radiogroup" aria-label="Note">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                          aria-pressed={reviewForm.note >= n}
                          onClick={() => setReviewForm((f) => ({ ...f, note: n }))}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          <i
                            className={`bi bi-star${reviewForm.note >= n ? '-fill' : ''}`}
                            style={{ fontSize: '1.5rem', color: reviewForm.note >= n ? 'var(--saffron)' : 'var(--border)', transition: 'color .15s' }}
                          ></i>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="review-text" style={{ fontSize: '.88rem', fontWeight: 600 }}>
                      Votre commentaire
                    </label>
                    <textarea
                      id="review-text"
                      className="form-control"
                      rows={4}
                      placeholder="Partagez votre expérience avec cet ouvrage…"
                      value={reviewForm.commentaire}
                      onChange={(e) => setReviewForm((f) => ({ ...f, commentaire: e.target.value }))}
                      disabled={!user}
                      style={{ borderRadius: 10, resize: 'none', fontSize: '.9rem' }}
                      required
                      minLength={10}
                      maxLength={1000}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-terra"
                    disabled={submittingReview || !user}
                  >
                    {submittingReview ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Publication…</>
                    ) : (
                      <><i className="bi bi-send me-2"></i>Publier l'avis</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
