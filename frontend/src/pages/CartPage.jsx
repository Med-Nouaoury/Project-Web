import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { createCommande } from '../services/api';
import ToastContainer, { useToast } from '../components/Toast';

export default function CartPage() {
  const { items, removeItem, setQty, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const { toasts, showToast } = useToast();
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
const imgSrc = (url) => url?.startsWith('http') ? url : `https://livregourmands-app.onrender.com${url}`
  const SHIPPING = totalPrice >= 49 ? 0 : 6.99;
  const TAX_RATE = 0.14975; // TPS + TVQ Québec
  const taxes = (totalPrice + SHIPPING) * TAX_RATE;
  const grandTotal = totalPrice + SHIPPING + taxes;
  console.log(items);
  const handleOrder = async () => {
    if (!user) {
      showToast('Veuillez vous connecter pour passer une commande.', 'warning');
      return;
    }
    setOrdering(true);
    try {
      await createCommande({
        lignes: items.map((i) => ({ ouvrage_id: i.id, quantite: i.qty, prix_unitaire: i.prix })),
        total: grandTotal.toFixed(2),
      });
      clearCart();
      setOrderSuccess(true);
    } catch {
      showToast('Erreur lors de la commande. Vérifiez votre connexion et réessayez.', 'error');
    } finally {
      setOrdering(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 560 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <i className="bi bi-check-lg text-white" style={{ fontSize: '2.5rem' }}></i>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--espresso)' }}>Commande confirmée !</h2>
        <p style={{ color: 'var(--muted)', marginTop: '.5rem' }}>
          Merci pour votre achat. Vous recevrez un courriel de confirmation sous peu.
        </p>
        <Link to="/" className="btn btn-terra mt-3">
          <i className="bi bi-arrow-left me-2"></i>Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <i className="bi bi-bag-x" style={{ fontSize: '4.5rem', color: 'var(--border)' }}></i>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--espresso)', marginTop: '1rem' }}>
          Votre panier est vide
        </h2>
        <p style={{ color: 'var(--muted)' }}>
          Explorez notre catalogue et ajoutez des ouvrages à votre panier.
        </p>
        <Link to="/" className="btn btn-terra mt-3">
          <i className="bi bi-arrow-left me-2"></i>Découvrir les livres
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div className="section-label">Mon panier</div>
            <h1 className="section-title">{totalItems} article{totalItems > 1 ? 's' : ''}</h1>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => { clearCart(); showToast('Panier vidé.', 'info'); }}
            aria-label="Vider le panier"
          >
            <i className="bi bi-trash me-1"></i>Vider le panier
          </button>
        </div>

        <div className="row g-4">
          {/* ── Cart items ── */}
          <div className="col-lg-8">
            <div role="list" aria-label="Articles du panier">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row" role="listitem">
                  {/* Image */}
                  <Link to={`/livre/${item.id}`} aria-label={`Voir ${item.titre}`}>
                    <div style={{ width: 70, height: 95, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--cream)' }}>
                      {item.image ? (
                        <img src={imgSrc(item.image)} alt={item.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <i className="bi bi-book" style={{ color: 'var(--muted)' }}></i>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-grow-1 min-width-0">
                    <Link to={`/livre/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--espresso)', fontSize: '.95rem', lineHeight: 1.3 }}>
                        {item.titre}
                      </div>
                    </Link>
                    <div style={{ fontSize: '.8rem', color: 'var(--muted)', marginTop: '.15rem' }}>
                      {parseFloat(item.prix).toFixed(2)} $ / unité
                    </div>

                    {/* Quantity controls */}
                    <div className="d-flex align-items-center gap-2 mt-2" role="group" aria-label={`Quantité pour ${item.titre}`}>
                      <button
                        className="qty-btn"
                        onClick={() => {
                          if (item.qty === 1) removeItem(item.id);
                          else setQty(item.id, item.qty - 1);
                        }}
                        aria-label="Diminuer la quantité"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '.95rem' }} aria-live="polite">
                        {item.qty}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => setQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                        aria-label="Augmenter la quantité"
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                      {item.qty >= item.stock && (
                        <span style={{ fontSize: '.75rem', color: 'var(--terracotta)', fontWeight: 600 }}>
                          Max atteint
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div className="text-end" style={{ flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: 'var(--terracotta)', fontSize: '1.05rem' }}>
                      {(item.qty * parseFloat(item.prix)).toFixed(2)} $
                    </div>
                    <button
                      className="btn btn-link btn-sm text-danger p-0 mt-1"
                      onClick={() => { removeItem(item.id); showToast(`"${item.titre}" retiré du panier.`, 'info'); }}
                      aria-label={`Retirer ${item.titre} du panier`}
                      style={{ fontSize: '.78rem', textDecoration: 'none' }}
                    >
                      <i className="bi bi-x me-1"></i>Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <Link to="/" className="btn btn-outline-terra mt-3">
              <i className="bi bi-arrow-left me-2"></i>Continuer mes achats
            </Link>
          </div>

          {/* ── Order summary ── */}
          <div className="col-lg-4">
            <div className="cart-summary-box" aria-label="Récapitulatif de la commande">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1.5rem' }}>
                Résumé
              </h3>

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '.9rem' }}>
                <span style={{ opacity: .75 }}>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                <span>{totalPrice.toFixed(2)} $</span>
              </div>

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '.9rem' }}>
                <span style={{ opacity: .75 }}>Livraison</span>
                <span style={{ color: SHIPPING === 0 ? '#6ee7b7' : '#fff' }}>
                  {SHIPPING === 0 ? 'Gratuite ✓' : `${SHIPPING.toFixed(2)} $`}
                </span>
              </div>

              {SHIPPING > 0 && (
                <div style={{ background: 'rgba(232,168,56,.15)', borderRadius: 8, padding: '.5rem .8rem', fontSize: '.78rem', color: 'var(--saffron)', marginBottom: '.75rem' }}>
                  <i className="bi bi-truck me-1"></i>
                  Plus que {(49 - totalPrice).toFixed(2)} $ pour la livraison gratuite !
                </div>
              )}

              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '.9rem' }}>
                <span style={{ opacity: .75 }}>TPS + TVQ</span>
                <span>{taxes.toFixed(2)} $</span>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,.15)' }} />

              <div className="d-flex justify-content-between mb-4" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: 'var(--saffron)' }}>{grandTotal.toFixed(2)} $</span>
              </div>

              <button
                className="btn btn-saffron w-100"
                style={{ padding: '.85rem', fontSize: '1rem', fontWeight: 800 }}
                onClick={handleOrder}
                disabled={ordering}
                aria-label="Passer la commande"
              >
                {ordering ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Traitement…</>
                ) : (
                  <><i className="bi bi-credit-card me-2"></i>Passer la commande</>
                )}
              </button>

              {!user && (
                <p style={{ fontSize: '.78rem', opacity: .65, textAlign: 'center', marginTop: '.75rem' }}>
                  <i className="bi bi-lock me-1"></i>
                  <Link to="/login" style={{ color: 'var(--saffron)' }}>Connectez-vous</Link> pour passer la commande
                </p>
              )}

              {/* Trust badges */}
              <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                {[['bi-shield-check', 'Paiement sécurisé'], ['bi-arrow-counterclockwise', 'Retour 30j']].map(([icon, label]) => (
                  <div key={label} style={{ fontSize: '.72rem', opacity: .6, display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                    <i className={`bi ${icon}`}></i>{label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}
