import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOuvrages } from '../services/api';
import BookCard from '../components/BookCard';
import ToastContainer, { useToast } from '../components/Toast';

const MOCK_FEATURED = [
  { id: 1, titre: 'Le Grand Livre de la Pâtisserie Française', auteur: 'Pierre Hermé', prix: 49.99, categorie: 'Pâtisserie', stock: 12, note_moyenne: 4.8, image_url: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400&h=550&fit=crop' },
  { id: 2, titre: 'Gastronomie Moléculaire', auteur: 'Ferran Adrià', prix: 62.00, categorie: 'Gastronomie', stock: 5, note_moyenne: 4.6, image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=550&fit=crop' },
  { id: 4, titre: "L'Art du Pain Artisan", auteur: 'Chad Robertson', prix: 44.95, categorie: 'Boulangerie', stock: 8, note_moyenne: 4.7, image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=550&fit=crop' },
  { id: 5, titre: 'Cuisine Végétarienne du Monde', auteur: 'Yotam Ottolenghi', prix: 41.00, categorie: 'Végétarien', stock: 15, note_moyenne: 4.5, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=550&fit=crop' },
];

const HERO_SLIDES = [
  { bg: 'linear-gradient(135deg,#2D1B0E 0%,#4a2c18 60%,#6b3d22 100%)', tag: 'Nouveauté printemps', title: 'Découvrez\nla cuisine\nsaisonnière', sub: 'Recettes fraîches et inspirantes pour célébrer chaque saison à votre table.', cta: 'Explorer le catalogue', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop' },
  { bg: 'linear-gradient(135deg,#1a3a2a 0%,#2d5a3d 60%,#4a7a52 100%)', tag: 'Coup de cœur', title: "L'art de\nla pâtisserie\nfrançaise", sub: "Les secrets des meilleurs chefs pâtissiers réunis dans un seul ouvrage de référence.", cta: 'Voir la sélection', img: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=800&h=600&fit=crop' },
  { bg: 'linear-gradient(135deg,#2a1a0e 0%,#5a3015 60%,#7a4520 100%)', tag: 'Voyage culinaire', title: 'Saveurs\ndu monde\nentier', sub: 'Explorez 50 cuisines du monde à travers des recettes authentiques et généreuses.', cta: 'Partir en voyage', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&h=600&fit=crop' },
];

const CATEGORIES = [
  { label: 'Pâtisserie', icon: 'bi-cake2', color: '#f8d7da', count: 142 },
  { label: 'Gastronomie', icon: 'bi-star', color: '#fff3cd', count: 89 },
  { label: 'Cuisine du monde', icon: 'bi-globe2', color: '#d1ecf1', count: 203 },
  { label: 'Végétarien', icon: 'bi-flower1', color: '#d4edda', count: 76 },
  { label: 'Boulangerie', icon: 'bi-bag-heart', color: '#fdebd0', count: 58 },
  { label: 'Vins', icon: 'bi-cup-hot', color: '#e8d5f5', count: 44 },
];

export default function HomePage() {
  const { toasts, showToast } = useToast();
  const [activeSlide, setActiveSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Carousel auto-play
  useEffect(() => {
    const t = setInterval(() => setActiveSlide((s) => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Load featured books (top 4 best rated)
  useEffect(() => {
    getOuvrages({ limit: 4, sort: 'note' })
      .then((res) => {
        const data = res.data?.ouvrages || res.data || [];
        setFeatured(data.length >= 4 ? data.slice(0, 4) : MOCK_FEATURED);
      })
      .catch(() => setFeatured(MOCK_FEATURED))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO CAROUSEL
      ══════════════════════════════════════════ */}
      <section
        className="hero-section"
        style={{ background: slide.bg, transition: 'background 0.8s ease' }}
        aria-label="Bannière promotionnelle"
      >
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="hero-badge fade-up">
                <i className="bi bi-stars"></i>{slide.tag}
              </div>
              <h1
                className="display-hero text-white fade-up fade-up-delay-1"
                style={{ whiteSpace: 'pre-line' }}
              >
                {slide.title}
              </h1>
              <p
                className="fade-up fade-up-delay-2"
                style={{ color: 'rgba(255,255,255,.72)', maxWidth: 440, marginTop: '1.2rem' }}
              >
                {slide.sub}
              </p>
              <div className="d-flex gap-3 mt-4 fade-up fade-up-delay-3 flex-wrap">
                <Link to="/catalogue" className="btn btn-saffron">
                  <i className="bi bi-arrow-right me-2"></i>{slide.cta}
                </Link>
                <Link to="/catalogue" className="btn" style={{ border: '2px solid rgba(255,255,255,.4)', color: '#fff', borderRadius: 50, padding: '.55rem 1.4rem', fontWeight: 600 }}>
                  Tout le catalogue
                </Link>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div style={{ position: 'relative', height: 380 }}>
                {HERO_SLIDES.map((s, i) => (
                  <img
                    key={i}
                    src={s.img}
                    alt=""
                    aria-hidden="true"
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', borderRadius: 24,
                      opacity: i === activeSlide ? 1 : 0,
                      transition: 'opacity .8s ease',
                      boxShadow: '0 30px 80px rgba(0,0,0,.4)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="d-flex gap-2 mt-4" role="tablist" aria-label="Navigation du carrousel">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeSlide}
                aria-label={`Diapositive ${i + 1}`}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: i === activeSlide ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  background: i === activeSlide ? 'var(--saffron)' : 'rgba(255,255,255,.3)',
                  transition: 'all .3s',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--espresso)', color: '#fff', padding: '1.25rem 0' }}>
        <div className="container">
          <div className="row text-center g-3">
            {[
              ['bi-book', '5 000+', 'Ouvrages disponibles'],
              ['bi-truck', 'Livraison gratuite', 'Dès 49 $ d\'achat'],
              ['bi-award', 'Qualité garantie', 'Sélection d\'experts'],
              ['bi-arrow-counterclockwise', 'Retour facile', '30 jours pour changer d\'avis'],
            ].map(([icon, val, desc]) => (
              <div key={val} className="col-6 col-md-3">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <i className={`bi ${icon}`} style={{ color: 'var(--saffron)', fontSize: '1.3rem', flexShrink: 0 }}></i>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '.9rem' }}>{val}</div>
                    <div style={{ fontSize: '.73rem', opacity: .6 }}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════════ */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="text-center mb-4">
            <div className="section-label">Parcourir par thème</div>
            <h2 className="section-title">Nos catégories</h2>
            <p style={{ color: 'var(--muted)', marginTop: '.4rem', fontSize: '.92rem' }}>
              Trouvez l'inspiration dans chaque univers culinaire
            </p>
          </div>

          <div className="row g-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.label} className="col-6 col-md-4 col-lg-2">
                <Link
                  to={`/catalogue?cat=${encodeURIComponent(cat.label)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: cat.color,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.4rem 1rem',
                      textAlign: 'center',
                      transition: 'transform .2s, box-shadow .2s',
                      cursor: 'pointer',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <i
                      className={`bi ${cat.icon}`}
                      style={{ fontSize: '1.8rem', color: 'var(--espresso)', display: 'block', marginBottom: '.5rem' }}
                    ></i>
                    <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--espresso)' }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: '.73rem', color: 'var(--muted)', marginTop: '.15rem' }}>
                      {cat.count} titres
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURED BOOKS (coups de coeur)
      ══════════════════════════════════════════ */}
      <section style={{ padding: '0 0 4.5rem', background: 'var(--warm-white)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <div className="section-label">Sélection du moment</div>
              <h2 className="section-title">Coups de cœur</h2>
            </div>
            <Link to="/catalogue" className="btn btn-outline-terra" style={{ flexShrink: 0 }}>
              Voir tout le catalogue <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="text-center py-4">
              <div
                className="spinner-border spinner-terra"
                style={{ width: '2rem', height: '2rem' }}
                role="status"
              >
                <span className="visually-hidden">Chargement…</span>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
              {featured.map((book) => (
                <div className="col" key={book.id}>
                  <BookCard book={book} onToast={(msg) => showToast(msg, 'success')} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EDITORIAL BANNER
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--espresso)', padding: '5rem 0' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="section-label" style={{ color: 'var(--saffron)' }}>Notre mission</div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.15,
                  marginTop: '.4rem',
                }}
              >
                La plus grande librairie<br />culinaire du Québec
              </h2>
              <p style={{ color: 'rgba(255,255,255,.65)', marginTop: '1rem', lineHeight: 1.8, maxWidth: 520 }}>
                Depuis 2018, nous rassemblons les meilleures œuvres gastronomiques mondiales pour
                les passionnés d'ici. Chaque titre est sélectionné avec soin par notre équipe
                d'experts culinaires.
              </p>
              <div className="d-flex gap-4 mt-4 flex-wrap">
                {[['5 000+', 'Ouvrages'], ['12 000+', 'Clients satisfaits'], ['50+', 'Pays couverts']].map(([num, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--saffron)', lineHeight: 1 }}>
                      {num}
                    </div>
                    <div style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.5)', marginTop: '.2rem' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden="true"
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12, opacity: .85 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--saffron)', padding: '3.5rem 0' }}>
        <div className="container text-center">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--espresso)',
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              fontWeight: 900,
            }}
          >
            Livraison offerte dès 49 $
          </h2>
          <p style={{ color: 'rgba(45,27,14,.7)', marginTop: '.5rem' }}>
            Partout au Québec — commandez aujourd'hui, livré sous 3–5 jours ouvrables.
          </p>
          <Link to="/catalogue" className="btn btn-terra mt-3" style={{ fontSize: '1rem', padding: '.7rem 2rem' }}>
            <i className="bi bi-bag me-2"></i>Commencer mes achats
          </Link>
        </div>
      </section>

      <ToastContainer toasts={toasts} />
    </>
  );
}
