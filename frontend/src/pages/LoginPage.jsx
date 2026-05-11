import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ courriel: '', mot_de_passe: '' });
  const [error, setError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(form);
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--espresso)' }}>
              <i className="bi bi-book-half me-2" style={{ color: 'var(--terracotta)' }}></i>
              LivresGourmands
            </div>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: '1.5rem', color: 'var(--espresso)' }}>
            Connexion
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>Accédez à votre compte</p>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          {error && (
            <div className="alert alert-custom alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="courriel" className="form-label" style={{ fontWeight: 600, fontSize: '.88rem' }}>
                Adresse courriel
              </label>
              <input
                id="courriel"
                type="email"
                className="form-control"
                placeholder="vous@exemple.com"
                value={form.courriel}
                onChange={(e) => setForm((f) => ({ ...f, courriel: e.target.value }))}
                required
                autoComplete="email"
                style={{ borderRadius: 10, borderColor: 'var(--border)', padding: '.65rem 1rem' }}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="mot_de_passe" className="form-label" style={{ fontWeight: 600, fontSize: '.88rem' }}>
                Mot de passe
              </label>
              <div className="input-group">
                <input
                  id="mot_de_passe"
                  type={showPwd ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={form.mot_de_passe}
                  onChange={(e) => setForm((f) => ({ ...f, mot_de_passe: e.target.value }))}
                  required
                  autoComplete="current-password"
                  style={{ borderRadius: '10px 0 0 10px', borderColor: 'var(--border)', padding: '.65rem 1rem' }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ border: '1px solid var(--border)', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: 'var(--cream)' }}
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <i className={`bi bi-eye${showPwd ? '-slash' : ''}`} style={{ color: 'var(--muted)' }}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-terra w-100"
              disabled={loading}
              style={{ padding: '.75rem', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Connexion…</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
                Créer un compte
              </Link>
            </span>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{ background: 'rgba(232,168,56,.1)', border: '1px solid rgba(232,168,56,.25)', borderRadius: 10, padding: '1rem', marginTop: '1.2rem', fontSize: '.82rem' }}>
          <strong style={{ color: 'var(--espresso)' }}>
            <i className="bi bi-lightbulb me-1" style={{ color: 'var(--saffron)' }}></i>
            Compte démo admin :
          </strong>
          <br />
          <span style={{ color: 'var(--muted)' }}>admin@livresgourmands.net / Admin1234!</span>
        </div>
      </div>
    </div>
  );
}
