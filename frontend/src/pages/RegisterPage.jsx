import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    courriel: '',
    mot_de_passe: '',
    confirm_mot_de_passe: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = 'Le prénom est requis.';
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.courriel.trim()) e.courriel = 'Le courriel est requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.courriel))
      e.courriel = 'Adresse courriel invalide.';
    if (!form.mot_de_passe) e.mot_de_passe = 'Le mot de passe est requis.';
    else if (form.mot_de_passe.length < 8)
      e.mot_de_passe = 'Minimum 8 caractères.';
    if (form.mot_de_passe !== form.confirm_mot_de_passe)
      e.confirm_mot_de_passe = 'Les mots de passe ne correspondent pas.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await register({
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        courriel: form.courriel.trim(),
        mot_de_passe: form.mot_de_passe,
      });
      navigate('/');
    } catch (err) {
      setServerError(err.message);
    }
  };

  const pwdStrength = () => {
    const p = form.mot_de_passe;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = pwdStrength();
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const strengthColors = ['#dc3545', '#fd7e14', '#ffc107', '#198754', '#0d6efd'];

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '85vh', padding: '2rem 1rem', background: 'var(--cream)' }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--espresso)',
              }}
            >
              <i className="bi bi-book-half me-2" style={{ color: 'var(--terracotta)' }}></i>
              LivresGourmands
            </div>
          </Link>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.7rem',
              marginTop: '1.5rem',
              color: 'var(--espresso)',
            }}
          >
            Créer un compte
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>
            Rejoignez notre communauté de passionnés culinaires
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
          }}
        >
          {/* Server error */}
          {serverError && (
            <div
              className="alert alert-custom alert-danger d-flex align-items-center gap-2 py-2 mb-4"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Prénom + Nom */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label
                  htmlFor="prenom"
                  className="form-label"
                  style={{ fontWeight: 600, fontSize: '.87rem' }}
                >
                  Prénom <span style={{ color: 'var(--terracotta)' }}>*</span>
                </label>
                <input
                  id="prenom"
                  type="text"
                  className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                  placeholder="Marie"
                  value={form.prenom}
                  onChange={set('prenom')}
                  autoComplete="given-name"
                  style={{ borderRadius: 10, borderColor: errors.prenom ? '#dc3545' : 'var(--border)', padding: '.6rem 1rem' }}
                />
                {errors.prenom && (
                  <div className="invalid-feedback" style={{ fontSize: '.78rem' }}>
                    {errors.prenom}
                  </div>
                )}
              </div>
              <div className="col-6">
                <label
                  htmlFor="nom"
                  className="form-label"
                  style={{ fontWeight: 600, fontSize: '.87rem' }}
                >
                  Nom <span style={{ color: 'var(--terracotta)' }}>*</span>
                </label>
                <input
                  id="nom"
                  type="text"
                  className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                  placeholder="Tremblay"
                  value={form.nom}
                  onChange={set('nom')}
                  autoComplete="family-name"
                  style={{ borderRadius: 10, borderColor: errors.nom ? '#dc3545' : 'var(--border)', padding: '.6rem 1rem' }}
                />
                {errors.nom && (
                  <div className="invalid-feedback" style={{ fontSize: '.78rem' }}>
                    {errors.nom}
                  </div>
                )}
              </div>
            </div>

            {/* Courriel */}
            <div className="mb-3">
              <label
                htmlFor="courriel"
                className="form-label"
                style={{ fontWeight: 600, fontSize: '.87rem' }}
              >
                Adresse courriel <span style={{ color: 'var(--terracotta)' }}>*</span>
              </label>
              <div className="input-group">
                <span
                  className="input-group-text"
                  style={{ borderRadius: '10px 0 0 10px', borderColor: errors.courriel ? '#dc3545' : 'var(--border)', background: 'var(--cream)' }}
                >
                  <i className="bi bi-envelope" style={{ color: 'var(--muted)' }}></i>
                </span>
                <input
                  id="courriel"
                  type="email"
                  className={`form-control ${errors.courriel ? 'is-invalid' : ''}`}
                  placeholder="marie@exemple.com"
                  value={form.courriel}
                  onChange={set('courriel')}
                  autoComplete="email"
                  style={{ borderRadius: '0 10px 10px 0', borderColor: errors.courriel ? '#dc3545' : 'var(--border)', padding: '.6rem 1rem' }}
                />
                {errors.courriel && (
                  <div className="invalid-feedback" style={{ fontSize: '.78rem' }}>
                    {errors.courriel}
                  </div>
                )}
              </div>
            </div>

            {/* Mot de passe */}
            <div className="mb-2">
              <label
                htmlFor="mot_de_passe"
                className="form-label"
                style={{ fontWeight: 600, fontSize: '.87rem' }}
              >
                Mot de passe <span style={{ color: 'var(--terracotta)' }}>*</span>
              </label>
              <div className="input-group">
                <input
                  id="mot_de_passe"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-control ${errors.mot_de_passe ? 'is-invalid' : ''}`}
                  placeholder="Minimum 8 caractères"
                  value={form.mot_de_passe}
                  onChange={set('mot_de_passe')}
                  autoComplete="new-password"
                  style={{ borderRadius: '10px 0 0 10px', borderColor: errors.mot_de_passe ? '#dc3545' : 'var(--border)', padding: '.6rem 1rem' }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ border: '1px solid', borderColor: errors.mot_de_passe ? '#dc3545' : 'var(--border)', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: 'var(--cream)' }}
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? 'Masquer' : 'Afficher'}
                >
                  <i className={`bi bi-eye${showPwd ? '-slash' : ''}`} style={{ color: 'var(--muted)' }}></i>
                </button>
                {errors.mot_de_passe && (
                  <div className="invalid-feedback" style={{ fontSize: '.78rem' }}>
                    {errors.mot_de_passe}
                  </div>
                )}
              </div>

              {/* Password strength bar */}
              {form.mot_de_passe && (
                <div className="mt-2">
                  <div className="d-flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: 4,
                          flex: 1,
                          borderRadius: 2,
                          background: strength >= i ? strengthColors[strength] : 'var(--border)',
                          transition: 'background .25s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '.72rem', color: strength ? strengthColors[strength] : 'var(--muted)', fontWeight: 600 }}>
                    {strength !== null ? strengthLabels[strength] : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Confirmer mot de passe */}
            <div className="mb-4">
              <label
                htmlFor="confirm_mot_de_passe"
                className="form-label"
                style={{ fontWeight: 600, fontSize: '.87rem' }}
              >
                Confirmer le mot de passe <span style={{ color: 'var(--terracotta)' }}>*</span>
              </label>
              <div className="input-group">
                <input
                  id="confirm_mot_de_passe"
                  type={showConfirm ? 'text' : 'password'}
                  className={`form-control ${errors.confirm_mot_de_passe ? 'is-invalid' : form.confirm_mot_de_passe && form.mot_de_passe === form.confirm_mot_de_passe ? 'is-valid' : ''}`}
                  placeholder="Répétez le mot de passe"
                  value={form.confirm_mot_de_passe}
                  onChange={set('confirm_mot_de_passe')}
                  autoComplete="new-password"
                  style={{ borderRadius: '10px 0 0 10px', padding: '.6rem 1rem' }}
                />
                <button
                  type="button"
                  className="btn"
                  style={{ border: '1px solid var(--border)', borderLeft: 'none', borderRadius: '0 10px 10px 0', background: 'var(--cream)' }}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Masquer' : 'Afficher'}
                >
                  <i className={`bi bi-eye${showConfirm ? '-slash' : ''}`} style={{ color: 'var(--muted)' }}></i>
                </button>
                {errors.confirm_mot_de_passe && (
                  <div className="invalid-feedback" style={{ fontSize: '.78rem' }}>
                    {errors.confirm_mot_de_passe}
                  </div>
                )}
                {form.confirm_mot_de_passe && form.mot_de_passe === form.confirm_mot_de_passe && (
                  <div className="valid-feedback" style={{ fontSize: '.78rem' }}>
                    Les mots de passe correspondent ✓
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-terra w-100"
              disabled={loading}
              style={{ padding: '.75rem', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Création du compte…
                </>
              ) : (
                <>
                  <i className="bi bi-person-check me-2"></i>
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
              Déjà inscrit ?{' '}
              <Link to="/login" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
                Se connecter
              </Link>
            </span>
          </div>
        </div>

        {/* Privacy note */}
        <p
          style={{
            textAlign: 'center',
            fontSize: '.75rem',
            color: 'var(--muted)',
            marginTop: '1rem',
            lineHeight: 1.6,
          }}
        >
          <i className="bi bi-shield-check me-1"></i>
          Vos informations sont protégées et ne seront jamais partagées à des tiers.
        </p>
      </div>
    </div>
  );
}
