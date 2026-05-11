import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <h6 className="mb-3">
              <i className="bi bi-book-half me-2" style={{ color: 'var(--saffron)' }}></i>
              LivresGourmands
            </h6>
            <p style={{ fontSize: '.85rem', lineHeight: 1.7 }}>
              La librairie culinaire de référence au Québec. Des milliers d'ouvrages pour tous
              les passionnés de gastronomie, pâtisserie et art de la table.
            </p>
            <div className="d-flex gap-3 mt-3">
              {['instagram', 'facebook', 'twitter-x', 'youtube'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  aria-label={icon}
                  style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.6)', transition: 'all .18s' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--saffron)')}
                  onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,.6)')}
                >
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3" style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Navigation
            </h6>
            <ul className="list-unstyled">
              {[['/', 'Accueil'], ['/catalogue', 'Catalogue'], ['/panier', 'Mon panier']].map(([to, label]) => (
                <li key={to} className="mb-2">
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="mb-3" style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Catégories
            </h6>
            <ul className="list-unstyled">
              {['Gastronomie', 'Pâtisserie', 'Végétarien', 'Cuisine du monde', 'Vins'].map((cat) => (
                <li key={cat} className="mb-2">
                  <a href={`/?cat=${encodeURIComponent(cat)}`}>{cat}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <h6 className="mb-3" style={{ fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Infolettre
            </h6>
            <p style={{ fontSize: '.83rem' }}>Recevez nos nouvelles parutions et offres exclusives.</p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="votre@courriel.com"
                style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', borderRadius: '8px 0 0 8px', fontSize: '.85rem' }}
                aria-label="Adresse courriel pour l'infolettre"
              />
              <button className="btn btn-saffron" style={{ borderRadius: '0 8px 8px 0', fontSize: '.85rem' }}>
                S'abonner
              </button>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,.08)', margin: '2rem 0 1rem' }} />
        <div className="d-flex flex-wrap justify-content-between align-items-center" style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
          <span>© {new Date().getFullYear()} LivresGourmands.net — Tous droits réservés</span>
          <span>Fait avec <i className="bi bi-heart-fill" style={{ color: 'var(--terracotta)' }}></i> à Montréal</span>
        </div>
      </div>
    </footer>
  );
}
