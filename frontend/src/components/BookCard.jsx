import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function BookCard({ book, onToast }) {
  const { addItem, items } = useCart();
  const [adding, setAdding] = useState(false);

  const inCart = items.find((i) => i.id === book.id);
  const outOfStock = (book.stock ?? book.quantite_stock ?? 0) <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setAdding(true);
    addItem({
      id: book.id,
      titre: book.titre,
      prix: book.prix,
      image: book.image_url || book.image,
      stock: book.stock ?? book.quantite_stock ?? 99,
    });
    onToast?.(`"${book.titre}" ajouté au panier !`);
    setTimeout(() => setAdding(false), 600);
  };
  const imgSrc = (url) => url?.startsWith('http') ? url : `https://livregourmands-app.onrender.com${url}`
  const avgNote = book.note_moyenne ? parseFloat(book.note_moyenne).toFixed(1) : null;

  return (
    <div className="book-card h-100">
      <Link to={`/livre/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="book-img-wrap">
          {book.image_url || book.image ? (
            <img
              src={imgSrc(book.image_url) || book.image}
              alt={book.titre}
              loading="lazy"
            />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ color: 'rgba(45,27,14,.3)' }}>
              <i className="bi bi-book" style={{ fontSize: '2.5rem' }}></i>
              <span style={{ fontSize: '.7rem', marginTop: '.3rem' }}>Pas d image</span>
            </div>
          )}
          <span
            className={`badge-stock badge ${outOfStock ? 'bg-danger' : inCart ? 'bg-success' : 'bg-warning text-dark'}`}
          >
            {outOfStock ? 'Épuisé' : inCart ? '✓ Dans le panier' : `${book.stock ?? book.quantite_stock ?? '?'} en stock`}
          </span>
        </div>

        <div className="book-body">
          {book.categorie && (
            <div className="book-cat">
              <i className="bi bi-tag me-1"></i>{book.categorie}
            </div>
          )}
          <div className="book-title">{book.titre}</div>
          <div className="book-author">
            <i className="bi bi-person me-1"></i>{book.auteur || 'Auteur inconnu'}
          </div>

          {avgNote && (
            <div className="d-flex align-items-center gap-1 mt-1">
              <span className="star-rating">{'★'.repeat(Math.round(avgNote))}</span>
              <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>({avgNote})</span>
            </div>
          )}

          <div className="d-flex align-items-center justify-content-between mt-2">
            <div className="book-price">{parseFloat(book.prix).toFixed(2)} $</div>
            <button
              className={`btn btn-sm ${outOfStock ? 'btn-secondary' : 'btn-terra'}`}
              onClick={handleAdd}
              disabled={outOfStock || adding}
              aria-label={outOfStock ? 'Produit épuisé' : `Ajouter ${book.titre} au panier`}
              style={{ fontSize: '.78rem', padding: '.35rem .8rem' }}
            >
              {adding ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : outOfStock ? (
                <><i className="bi bi-x-circle me-1"></i>Épuisé</>
              ) : (
                <><i className="bi bi-bag-plus me-1"></i>Ajouter</>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
