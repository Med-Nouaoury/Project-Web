import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getOuvrages, createOuvrage, updateOuvrage, deleteOuvrage,
  getCommandes, updateCommandeStatus, getUtilisateurs,
} from '../services/api';
import ToastContainer, { useToast } from '../components/Toast';

/* ── Mock data (fallback si API offline) ─────────────────── */
const MOCK_BOOKS = [
  { id: 1, titre: 'Le Grand Livre de la Pâtisserie', auteur: 'Pierre Hermé', prix: 49.99, categorie: 'Pâtisserie', stock: 12 },
  { id: 2, titre: 'Gastronomie Moléculaire', auteur: 'Ferran Adrià', prix: 62.00, categorie: 'Gastronomie', stock: 5 },
  { id: 3, titre: 'Saveurs du Maroc', auteur: 'Paula Wolfert', prix: 38.50, categorie: 'Cuisine du monde', stock: 0 },
  { id: 4, titre: "L'Art du Pain Artisan", auteur: 'Chad Robertson', prix: 44.95, categorie: 'Boulangerie', stock: 8 },
  { id: 5, titre: 'Encyclopédie des Vins', auteur: 'Jancis Robinson', prix: 89.99, categorie: 'Vins', stock: 3 },
  { id: 6, titre: 'Cuisine Végétarienne', auteur: 'Yotam Ottolenghi', prix: 41.00, categorie: 'Végétarien', stock: 15 },
];
const MOCK_ORDERS = [
  { id: 1047, utilisateur: { prenom: 'Marie', nom: 'Tremblay' }, total: 88.49, statut: 'en_attente', created_at: '2025-05-11T10:20:00Z', nb_articles: 2 },
  { id: 1046, utilisateur: { prenom: 'Jean', nom: 'Dupont' }, total: 120.00, statut: 'livree', created_at: '2025-05-10T14:00:00Z', nb_articles: 3 },
  { id: 1045, utilisateur: { prenom: 'Isabelle', nom: 'Roy' }, total: 55.90, statut: 'en_cours', created_at: '2025-05-09T08:30:00Z', nb_articles: 1 },
  { id: 1044, utilisateur: { prenom: 'Alain', nom: 'Bouchard' }, total: 204.50, statut: 'livree', created_at: '2025-05-08T11:00:00Z', nb_articles: 4 },
  { id: 1043, utilisateur: { prenom: 'Sophie', nom: 'Côté' }, total: 38.50, statut: 'annulee', created_at: '2025-05-07T16:45:00Z', nb_articles: 1 },
];
const MOCK_USERS = [
  { id: 1, prenom: 'Admin', nom: 'LG', courriel: 'admin@livresgourmands.net', role: 'admin', created_at: '2024-01-01' },
  { id: 2, prenom: 'Marie', nom: 'Tremblay', courriel: 'marie.t@mail.com', role: 'client', created_at: '2024-03-15' },
  { id: 3, prenom: 'Jean', nom: 'Dupont', courriel: 'jean.d@mail.com', role: 'client', created_at: '2024-04-02' },
];

const STATUS_CONFIG = {
  en_attente: { label: 'En attente', cls: 'badge-warn', icon: 'bi-clock' },
  en_cours:   { label: 'En cours',   cls: 'badge-info', icon: 'bi-truck' },
  livree:     { label: 'Livrée',     cls: 'badge-ok',   icon: 'bi-check-circle' },
  annulee:    { label: 'Annulée',    cls: 'badge-err',  icon: 'bi-x-circle' },
};

const EMPTY_FORM = { titre: '', auteur: '', prix: '', categorie: '', stock: '', description: '', image_url: '' };

const ACTIVITY = [
  { color: '#3d8c52', text: 'Commande #1047 créée', sub: 'Marie Tremblay — 88,49 $', time: 'Il y a 12 min' },
  { color: '#E8A838', text: 'Stock faible : Gastronomie Moléculaire', sub: '5 exemplaires restants', time: 'Il y a 34 min' },
  { color: '#5c6bc0', text: 'Nouvel utilisateur inscrit', sub: 'pierre.martin@mail.com', time: 'Il y a 1h 08' },
  { color: '#C4593A', text: 'Commande #1043 annulée', sub: 'Sophie Côté', time: 'Il y a 2h 15' },
  { color: '#3d8c52', text: 'Commande #1046 livrée', sub: 'Jean Dupont', time: 'Il y a 4h 10' },
];

/* ── Helpers ─────────────────────────────────────────────── */
function initials(prenom, nom) {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase();
}

function StatusBadge({ statut }) {
  const cfg = STATUS_CONFIG[statut] || { label: statut, cls: 'badge-warn', icon: 'bi-question' };
  return (
    <span className={`badge-admin ${cfg.cls}`}>
      <i className={`bi ${cfg.icon}`}></i>{cfg.label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast } = useToast();
  const chartRef = useRef(null);
  const donutRef = useRef(null);
  const chartInstances = useRef({});

  const [section, setSection] = useState('overview');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchBooks, setSearchBooks] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  /* ── Data loading ── */
  const loadBooks = useCallback(() => {
    setLoading(true);
    getOuvrages()
      .then((r) => setBooks(r.data?.ouvrages || r.data || []))
      .catch(() => setBooks(MOCK_BOOKS))
      .finally(() => setLoading(false));
  }, []);

  const loadOrders = useCallback(() => {
    setLoading(true);
    getCommandes()
      .then((r) => setOrders(r.data?.commandes || r.data || []))
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  const loadUsers = useCallback(() => {
    setLoading(true);
    getUtilisateurs()
      .then((r) => setUsers(r.data?.utilisateurs || r.data || []))
      .catch(() => setUsers(MOCK_USERS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (['overview', 'books'].includes(section)) loadBooks();
    if (['overview', 'orders'].includes(section)) loadOrders();
    if (['overview', 'users'].includes(section)) loadUsers();
  }, [section]);

  /* ── Charts (overview only) ── */
  useEffect(() => {
    if (section !== 'overview') return;
    const timer = setTimeout(() => {
      if (typeof window.Chart === 'undefined') return;

      // Destroy existing
      Object.values(chartInstances.current).forEach((c) => c?.destroy());

      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const textCol = isDark ? 'rgba(255,255,255,.45)' : '#8A7F78';
      const gridCol = isDark ? 'rgba(255,255,255,.06)' : '#F0E8DF';

      if (chartRef.current) {
        chartInstances.current.bar = new window.Chart(chartRef.current, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
            datasets: [
              { label: 'Livrées', data: [6800, 7200, 8100, 7600, 9200, 9400], backgroundColor: '#C4593A', borderRadius: 4, barPercentage: 0.65 },
              { label: 'En attente', data: [800, 600, 900, 700, 1100, 980], backgroundColor: '#E8A838', borderRadius: 4, barPercentage: 0.65 },
            ],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y.toLocaleString('fr-CA') + ' $' } } },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { color: textCol, font: { size: 11 } } },
              y: { stacked: true, grid: { color: gridCol }, border: { display: false }, ticks: { color: textCol, font: { size: 11 }, callback: v => (v / 1000).toFixed(0) + 'k $' } },
            },
          },
        });
      }

      if (donutRef.current) {
        chartInstances.current.donut = new window.Chart(donutRef.current, {
          type: 'doughnut',
          data: {
            labels: ['Livrées', 'En cours', 'En attente', 'Annulées'],
            datasets: [{ data: [58, 22, 14, 6], backgroundColor: ['#C4593A', '#E8A838', '#6B8F71', '#d4d0c8'], borderWidth: 0, hoverOffset: 4 }],
          },
          options: { responsive: true, maintainAspectRatio: true, cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed + '%' } } } },
        });
      }
    }, 120);
    return () => { clearTimeout(timer); Object.values(chartInstances.current).forEach((c) => c?.destroy()); };
  }, [section]);

  /* ── CRUD ── */
  const openAdd = () => { setForm(EMPTY_FORM); setEditBook(null); setModal('add'); };
  const openEdit = (b) => { setForm({ ...b, prix: String(b.prix), stock: String(b.stock) }); setEditBook(b); setModal('edit'); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal === 'add') { await createOuvrage(form); showToast('Ouvrage ajouté !', 'success'); }
      else { await updateOuvrage(editBook.id, form); showToast('Ouvrage mis à jour !', 'success'); }
      setModal(null); loadBooks();
    } catch { showToast("Erreur lors de l'enregistrement.", 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteOuvrage(id); setBooks((p) => p.filter((b) => b.id !== id)); showToast('Ouvrage supprimé.', 'info'); }
    catch { showToast('Impossible de supprimer.', 'error'); }
    setConfirmDelete(null);
  };

  const handleStatusChange = async (orderId, statut) => {
    try { await updateCommandeStatus(orderId, statut); setOrders((p) => p.map((o) => o.id === orderId ? { ...o, statut } : o)); showToast('Statut mis à jour !', 'success'); }
    catch { showToast('Impossible de changer le statut.', 'error'); }
  };

  /* ── Derived ── */
  const filteredBooks = books.filter((b) =>
    !searchBooks || b.titre?.toLowerCase().includes(searchBooks.toLowerCase()) || b.auteur?.toLowerCase().includes(searchBooks.toLowerCase())
  );
  const totalRevenue = orders.filter((o) => o.statut === 'livree').reduce((s, o) => s + parseFloat(o.total || 0), 0);

  const STATS = [
    { icon: 'bi-book', bg: '#fef3e2', color: '#E8A838', label: 'Ouvrages', value: books.length || '5 284', delta: '+38 ce mois', up: true },
    { icon: 'bi-bag', bg: '#fce8e3', color: '#C4593A', label: 'Commandes', value: orders.length || '1 047', delta: '+12% ce mois', up: true },
    { icon: 'bi-cash-stack', bg: '#d4edda', color: '#3d8c52', label: 'Revenu', value: totalRevenue > 0 ? `${totalRevenue.toFixed(0)} $` : '48 320 $', delta: '+8.4% ce mois', up: true },
    { icon: 'bi-people', bg: '#e8eaf6', color: '#5c6bc0', label: 'Clients', value: users.length || '3 761', delta: '+203 nouveaux', up: true },
  ];

  const NAV = [
    { key: 'overview', icon: 'bi-speedometer2', label: "Vue d'ensemble" },
    { key: 'books', icon: 'bi-book', label: 'Ouvrages' },
    { key: 'orders', icon: 'bi-bag', label: 'Commandes' },
    { key: 'users', icon: 'bi-people', label: 'Utilisateurs' },
  ];

  /* ════════════════════════════════════
     RENDER
  ════════════════════════════════════ */
  return (
    <>
      {/* Inline dashboard styles */}
      <style>{`
        .admin-shell { display:flex; min-height:100vh; background:var(--cream); }
        /* ── Sidebar ── */
        .adm-sidebar {
          width:240px; background:#1e1208; display:flex; flex-direction:column;
          position:fixed; top:0; left:0; height:100vh; z-index:200;
          transition:transform .25s;
        }
        .adm-sidebar.closed { transform:translateX(-100%); }
        @media(min-width:768px){ .adm-sidebar{ transform:none!important; } }
        .adm-logo {
          padding:18px 20px 16px; border-bottom:1px solid rgba(255,255,255,.07);
          font-family:var(--font-display); font-size:1.1rem; font-weight:900; color:#fff;
          display:flex; align-items:center; gap:9px;
        }
        .adm-logo-icon { width:28px;height:28px;background:#C4593A;border-radius:8px;display:flex;align-items:center;justify-content:center; flex-shrink:0; }
        .adm-logo span { color:#E8A838; }
        .adm-section-label { padding:14px 20px 4px; font-size:.67rem; font-weight:800; text-transform:uppercase; letter-spacing:.1em; color:rgba(255,255,255,.25); }
        .adm-nav-link {
          display:flex; align-items:center; gap:10px;
          padding:9px 20px; font-size:.85rem; font-weight:500;
          color:rgba(255,255,255,.5); cursor:pointer;
          border-left:2px solid transparent;
          transition:all .15s; background:none; border-right:none; border-top:none; border-bottom:none;
          width:100%; text-align:left;
        }
        .adm-nav-link:hover { background:rgba(255,255,255,.05); color:rgba(255,255,255,.8); }
        .adm-nav-link.active { background:rgba(255,255,255,.07); color:#fff; border-left-color:#E8A838; }
        .adm-nav-link i { font-size:1rem; width:18px; }
        .adm-footer {
          margin-top:auto; padding:14px 20px;
          border-top:1px solid rgba(255,255,255,.06);
          display:flex; align-items:center; gap:10px;
        }
        .adm-avatar { width:32px;height:32px;border-radius:50%;background:#C4593A;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:#fff;flex-shrink:0; }
        .adm-user-name { font-size:.82rem; color:rgba(255,255,255,.75); font-weight:600; }
        .adm-user-role { font-size:.7rem; color:rgba(255,255,255,.3); }
        /* ── Main ── */
        .adm-main { margin-left:240px; flex:1; display:flex; flex-direction:column; min-height:100vh; }
        @media(max-width:767px){ .adm-main{ margin-left:0; } }
        /* ── Topbar ── */
        .adm-topbar {
          background:var(--card-bg); border-bottom:1px solid var(--border);
          padding:0 24px; height:56px;
          display:flex; align-items:center; justify-content:space-between;
          position:sticky; top:0; z-index:100;
        }
        .adm-topbar-left { display:flex; align-items:center; gap:12px; }
        .adm-page-title { font-family:var(--font-display); font-size:1.1rem; font-weight:900; color:var(--espresso); }
        .adm-breadcrumb { font-size:.75rem; color:var(--muted); }
        .adm-topbar-actions { display:flex; align-items:center; gap:8px; }
        .adm-btn {
          height:32px; padding:0 12px;
          border-radius:8px; border:1px solid var(--border);
          background:var(--card-bg); font-size:.8rem; font-weight:600;
          color:var(--charcoal); cursor:pointer;
          display:flex; align-items:center; gap:5px; transition:all .15s;
          font-family:var(--font-body);
        }
        .adm-btn:hover { background:var(--cream); }
        .adm-btn.primary { background:#C4593A; color:#fff; border-color:#C4593A; }
        .adm-btn.primary:hover { background:#b04c31; }
        /* ── Content ── */
        .adm-content { flex:1; padding:24px; display:flex; flex-direction:column; gap:16px; }
        /* ── Stat cards ── */
        .adm-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        @media(max-width:900px){ .adm-stats{ grid-template-columns:repeat(2,1fr); } }
        .adm-stat {
          background:var(--card-bg); border:1px solid var(--border);
          border-radius:var(--radius-lg); padding:14px 16px;
        }
        .adm-stat-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;margin-bottom:10px; }
        .adm-stat-label { font-size:.7rem; font-weight:800; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); }
        .adm-stat-value { font-size:1.6rem; font-weight:900; color:var(--espresso); line-height:1.15; font-family:var(--font-display); margin-top:2px; }
        .adm-stat-delta { font-size:.72rem; margin-top:4px; display:flex; align-items:center; gap:3px; }
        .delta-up { color:#3d8c52; }
        .delta-down { color:#b84040; }
        /* ── Cards ── */
        .adm-card { background:var(--card-bg); border:1px solid var(--border); border-radius:var(--radius-lg); padding:16px; }
        .adm-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
        .adm-card-title { font-family:var(--font-display); font-size:1rem; font-weight:800; color:var(--espresso); }
        .adm-card-sub { font-size:.75rem; color:var(--muted); margin-top:1px; }
        /* ── Charts row ── */
        .charts-row { display:grid; grid-template-columns:1.6fr 1fr; gap:12px; }
        @media(max-width:800px){ .charts-row{ grid-template-columns:1fr; } }
        /* ── Legend ── */
        .chart-legend { display:flex; gap:14px; font-size:.72rem; color:var(--muted); }
        .legend-dot { width:8px;height:8px;border-radius:2px;margin-right:4px;display:inline-block; }
        /* ── Donut ── */
        .donut-wrap { display:flex; align-items:center; gap:20px; padding-top:4px; }
        .donut-legend-list { display:flex; flex-direction:column; gap:8px; font-size:.78rem; flex:1; }
        .donut-item { display:flex; align-items:center; gap:7px; color:var(--charcoal); }
        .donut-swatch { width:10px;height:10px;border-radius:3px;flex-shrink:0; }
        /* ── Table ── */
        .adm-table-wrap { overflow-x:auto; }
        .adm-table { width:100%; border-collapse:collapse; font-size:.82rem; }
        .adm-table thead th {
          padding:8px 12px; text-align:left;
          font-size:.67rem; font-weight:800;
          text-transform:uppercase; letter-spacing:.07em;
          color:var(--muted); background:var(--cream);
          border-bottom:1px solid var(--border);
        }
        .adm-table tbody td { padding:10px 12px; border-bottom:1px solid var(--border); vertical-align:middle; color:var(--charcoal); }
        .adm-table tbody tr:last-child td { border-bottom:none; }
        .adm-table tbody tr:hover td { background:var(--cream); }
        /* ── Badges ── */
        .badge-admin {
          display:inline-flex; align-items:center; gap:4px;
          padding:3px 8px; border-radius:20px;
          font-size:.7rem; font-weight:700;
        }
        .badge-admin i { font-size:.7rem; }
        .badge-warn { background:#fef3cd; color:#92660a; }
        .badge-ok   { background:#d4edda; color:#1a5c2e; }
        .badge-info { background:#d4e8f5; color:#1a4a6c; }
        .badge-err  { background:#f8d7da; color:#7a1c20; }
        /* ── Avatar ── */
        .tbl-avatar { width:26px;height:26px;border-radius:50%;font-size:.7rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:#fce8e3;color:#7a2c18;margin-right:7px;flex-shrink:0; }
        /* ── Bottom row ── */
        .bottom-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:700px){ .bottom-row{ grid-template-columns:1fr; } }
        /* ── Activity ── */
        .activity-list { display:flex; flex-direction:column; gap:10px; }
        .activity-item { display:flex; align-items:flex-start; gap:10px; font-size:.8rem; }
        .activity-dot { width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0; }
        .activity-text { color:var(--charcoal); line-height:1.4; }
        .activity-sub { font-size:.72rem; color:var(--muted); margin-top:1px; }
        .activity-time { font-size:.68rem; color:var(--muted); margin-top:1px; }
        /* ── Stock bar ── */
        .stock-bar { height:4px; border-radius:2px; background:var(--border); margin-top:4px; overflow:hidden; }
        .stock-bar-fill { height:100%; border-radius:2px; }
        /* ── Search input ── */
        .adm-search { display:flex; align-items:center; gap:8px; }
        .adm-search input {
          height:32px; padding:0 10px 0 32px; border-radius:8px;
          border:1px solid var(--border); background:var(--cream);
          font-size:.82rem; color:var(--charcoal);
          font-family:var(--font-body); outline:none;
        }
        .adm-search input:focus { border-color:var(--terracotta); }
        .adm-search-wrap { position:relative; }
        .adm-search-icon { position:absolute; left:9px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:.85rem; pointer-events:none; }
        /* ── Overlay ── */
        .sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:199; }
        @media(max-width:767px){ .sidebar-overlay.show{ display:block; } }
        /* ── Empty state ── */
        .adm-empty { text-align:center; padding:3rem 1rem; color:var(--muted); }
        .adm-empty i { font-size:2.5rem; display:block; margin-bottom:.75rem; }
      `}</style>

      {/* Load Chart.js */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" defer></script>

      <div className="admin-shell">
        {/* ── SIDEBAR ── */}
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} style={{ display: sidebarOpen ? 'block' : 'none' }} aria-hidden="true" />

        <aside className={`adm-sidebar${sidebarOpen ? '' : ' closed'}`} aria-label="Navigation admin">
          <div className="adm-logo">
            <div className="adm-logo-icon"><i className="bi bi-book-half" style={{ color: '#fff', fontSize: '.85rem' }}></i></div>
            Livres<span>Gourmands</span>
          </div>

          <nav style={{ flex: 1, paddingTop: 8 }}>
            <div className="adm-section-label">Principal</div>
            {NAV.map(({ key, icon, label }) => (
              <button
                key={key}
                className={`adm-nav-link${section === key ? ' active' : ''}`}
                onClick={() => { setSection(key); setSidebarOpen(false); }}
                aria-current={section === key ? 'page' : undefined}
              >
                <i className={`bi ${icon}`}></i>{label}
              </button>
            ))}

            <div className="adm-section-label" style={{ marginTop: 8 }}>Accès rapide</div>
            <Link to="/" className="adm-nav-link" style={{ textDecoration: 'none' }}>
              <i className="bi bi-house"></i>Voir le site
            </Link>
            <Link to="/catalogue" className="adm-nav-link" style={{ textDecoration: 'none' }}>
              <i className="bi bi-grid"></i>Catalogue public
            </Link>
          </nav>

          <div className="adm-footer">
            <div className="adm-avatar">{initials(user?.prenom, user?.nom)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="adm-user-name">{user?.prenom} {user?.nom}</div>
              <div className="adm-user-role">Administrateur</div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.35)', cursor: 'pointer', padding: 4 }}
              title="Déconnexion"
              aria-label="Déconnexion"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="adm-main">
          {/* Topbar */}
          <div className="adm-topbar">
            <div className="adm-topbar-left">
              <button
                className="d-md-none adm-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Ouvrir le menu"
                style={{ padding: '0 8px' }}
              >
                <i className="bi bi-list fs-5"></i>
              </button>
              <div>
                <div className="adm-page-title">{NAV.find(n => n.key === section)?.label || section}</div>
                <div className="adm-breadcrumb">Admin · LivresGourmands</div>
              </div>
            </div>
            <div className="adm-topbar-actions">
              <button className="adm-btn" onClick={() => showToast('Exportation lancée…', 'info')}>
                <i className="bi bi-download"></i>Exporter
              </button>
              <button className="adm-btn primary" onClick={() => { setSection('books'); openAdd(); }}>
                <i className="bi bi-plus"></i>Nouveau livre
              </button>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="adm-content">

            {/* ═══════════ OVERVIEW ═══════════ */}
            {section === 'overview' && (
              <>
                {/* Stats */}
                <div className="adm-stats">
                  {STATS.map(({ icon, bg, color, label, value, delta, up }) => (
                    <div className="adm-stat" key={label}>
                      <div className="adm-stat-icon" style={{ background: bg }}>
                        <i className={`bi ${icon}`} style={{ color }}></i>
                      </div>
                      <div className="adm-stat-label">{label}</div>
                      <div className="adm-stat-value">{value}</div>
                      <div className={`adm-stat-delta ${up ? 'delta-up' : 'delta-down'}`}>
                        <i className={`bi bi-trending-${up ? 'up' : 'down'}`}></i>{delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="charts-row">
                  <div className="adm-card">
                    <div className="adm-card-header">
                      <div>
                        <div className="adm-card-title">Revenus mensuels</div>
                        <div className="adm-card-sub">Janvier — Juin 2025</div>
                      </div>
                      <div className="chart-legend">
                        <span><span className="legend-dot" style={{ background: '#C4593A' }}></span>Livrées</span>
                        <span><span className="legend-dot" style={{ background: '#E8A838' }}></span>En attente</span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: 180 }}>
                      <canvas ref={chartRef} role="img" aria-label="Graphique des revenus mensuels">
                        Revenus : Jan 6800$, Fév 7200$, Mar 8100$, Avr 7600$, Mai 9200$, Juin 9400$
                      </canvas>
                    </div>
                  </div>

                  <div className="adm-card">
                    <div className="adm-card-header">
                      <div>
                        <div className="adm-card-title">Statut commandes</div>
                        <div className="adm-card-sub">Ce mois-ci</div>
                      </div>
                    </div>
                    <div className="donut-wrap">
                      <div style={{ width: 110, height: 110, flexShrink: 0 }}>
                        <canvas ref={donutRef} role="img" aria-label="Répartition statut commandes">
                          Livrées 58%, En cours 22%, En attente 14%, Annulées 6%
                        </canvas>
                      </div>
                      <div className="donut-legend-list">
                        {[['#C4593A', 'Livrées', '58%'], ['#E8A838', 'En cours', '22%'], ['#6B8F71', 'En attente', '14%'], ['#d4d0c8', 'Annulées', '6%']].map(([color, label, pct]) => (
                          <div key={label} className="donut-item">
                            <div className="donut-swatch" style={{ background: color }}></div>
                            <span>{label}</span>
                            <strong style={{ marginLeft: 'auto', color: 'var(--espresso)', fontSize: '.8rem' }}>{pct}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last orders table */}
                <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="adm-card-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div className="adm-card-title">Dernières commandes</div>
                    </div>
                    <button className="adm-btn" onClick={() => setSection('orders')}>
                      Tout voir <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                  <div className="adm-table-wrap">
                    <table className="adm-table" aria-label="Dernières commandes">
                      <thead>
                        <tr>
                          <th>N°</th><th>Client</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders.length > 0 ? orders : MOCK_ORDERS).slice(0, 5).map((o) => (
                          <tr key={o.id}>
                            <td style={{ fontWeight: 700, color: 'var(--terracotta)' }}>#{o.id}</td>
                            <td style={{ display: 'flex', alignItems: 'center' }}>
                              <span className="tbl-avatar">{initials(o.utilisateur?.prenom, o.utilisateur?.nom)}</span>
                              {o.utilisateur?.prenom} {o.utilisateur?.nom}
                            </td>
                            <td style={{ color: 'var(--muted)' }}>{o.nb_articles} article{o.nb_articles > 1 ? 's' : ''}</td>
                            <td style={{ fontWeight: 700 }}>{parseFloat(o.total).toFixed(2)} $</td>
                            <td style={{ color: 'var(--muted)' }}>{new Date(o.created_at).toLocaleDateString('fr-CA')}</td>
                            <td><StatusBadge statut={o.statut} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom row */}
                <div className="bottom-row">
                  {/* Top books */}
                  <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="adm-card-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                      <div className="adm-card-title">Ouvrages + vendus</div>
                      <button className="adm-btn" onClick={() => setSection('books')}>Gérer</button>
                    </div>
                    <div className="adm-table-wrap">
                      <table className="adm-table">
                        <thead><tr><th>Titre</th><th>Ventes</th><th>Stock</th></tr></thead>
                        <tbody>
                          {[['Le Grand Livre de la Pâtisserie', 84, 12, 20], ['Gastronomie Moléculaire', 61, 5, 20], ["L'Art du Pain Artisan", 58, 8, 20], ['Encyclopédie des Vins', 47, 0, 20], ['Saveurs du Maroc', 43, 9, 20]].map(([titre, ventes, stock, max]) => (
                            <tr key={titre}>
                              <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{titre}</td>
                              <td style={{ fontWeight: 700 }}>{ventes}</td>
                              <td>
                                <span className={`badge-admin ${stock === 0 ? 'badge-err' : stock <= 5 ? 'badge-warn' : 'badge-ok'}`}>
                                  {stock}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="adm-card">
                    <div className="adm-card-header">
                      <div className="adm-card-title">Activité récente</div>
                    </div>
                    <div className="activity-list">
                      {ACTIVITY.map((a, i) => (
                        <div key={i} className="activity-item">
                          <div className="activity-dot" style={{ background: a.color }}></div>
                          <div>
                            <div className="activity-text">{a.text}</div>
                            <div className="activity-sub">{a.sub}</div>
                            <div className="activity-time">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════ BOOKS ═══════════ */}
            {section === 'books' && (
              <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="adm-card-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="adm-search">
                    <div className="adm-search-wrap">
                      <i className="bi bi-search adm-search-icon"></i>
                      <input
                        type="search"
                        placeholder="Titre ou auteur…"
                        value={searchBooks}
                        onChange={(e) => setSearchBooks(e.target.value)}
                        aria-label="Rechercher un ouvrage"
                      />
                    </div>
                    <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{filteredBooks.length} résultat(s)</span>
                  </div>
                  <button className="adm-btn primary" onClick={openAdd}>
                    <i className="bi bi-plus"></i>Ajouter
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border spinner-terra" role="status">
                      <span className="visually-hidden">Chargement…</span>
                    </div>
                  </div>
                ) : (
                  <div className="adm-table-wrap">
                    <table className="adm-table" aria-label="Liste des ouvrages">
                      <thead>
                        <tr><th>Titre</th><th>Auteur</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {filteredBooks.map((b) => (
                          <tr key={b.id}>
                            <td style={{ fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.titre}</td>
                            <td style={{ color: 'var(--muted)' }}>{b.auteur}</td>
                            <td>
                              <span className="badge-admin badge-info">{b.categorie}</span>
                            </td>
                            <td style={{ fontWeight: 700, color: 'var(--terracotta)' }}>{parseFloat(b.prix).toFixed(2)} $</td>
                            <td>
                              <span className={`badge-admin ${(b.stock ?? b.quantite_stock) <= 0 ? 'badge-err' : (b.stock ?? b.quantite_stock) <= 5 ? 'badge-warn' : 'badge-ok'}`}>
                                {b.stock ?? b.quantite_stock ?? '?'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <button className="adm-btn" onClick={() => openEdit(b)} aria-label={`Modifier ${b.titre}`} style={{ padding: '0 7px' }}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="adm-btn" onClick={() => setConfirmDelete(b)} aria-label={`Supprimer ${b.titre}`} style={{ padding: '0 7px', borderColor: '#f8d7da', color: '#7a1c20' }}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredBooks.length === 0 && (
                          <tr><td colSpan={6} className="adm-empty"><i className="bi bi-search"></i>Aucun ouvrage trouvé.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════ ORDERS ═══════════ */}
            {section === 'orders' && (
              <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="adm-card-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="adm-card-title">Toutes les commandes</div>
                  <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{orders.length} commande(s)</span>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table" aria-label="Liste des commandes">
                    <thead>
                      <tr><th>N°</th><th>Client</th><th>Articles</th><th>Total</th><th>Date</th><th>Statut</th></tr>
                    </thead>
                    <tbody>
                      {(orders.length > 0 ? orders : MOCK_ORDERS).map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 700, color: 'var(--terracotta)' }}>#{o.id}</td>
                          <td style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="tbl-avatar">{initials(o.utilisateur?.prenom, o.utilisateur?.nom)}</span>
                            {o.utilisateur?.prenom} {o.utilisateur?.nom}
                          </td>
                          <td style={{ color: 'var(--muted)' }}>{o.nb_articles}</td>
                          <td style={{ fontWeight: 700 }}>{parseFloat(o.total).toFixed(2)} $</td>
                          <td style={{ color: 'var(--muted)' }}>{new Date(o.created_at).toLocaleDateString('fr-CA')}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={o.statut}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                              style={{ borderRadius: 8, fontSize: '.75rem', width: 'auto', minWidth: 120, borderColor: 'var(--border)' }}
                              aria-label={`Statut commande #${o.id}`}
                            >
                              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                                <option key={key} value={key}>{label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══════════ USERS ═══════════ */}
            {section === 'users' && (
              <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="adm-card-header" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="adm-card-title">Utilisateurs</div>
                  <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>{users.length} inscrit(s)</span>
                </div>
                {loading ? (
                  <div className="text-center py-4"><div className="spinner-border spinner-terra" role="status"><span className="visually-hidden">Chargement…</span></div></div>
                ) : (
                  <div className="adm-table-wrap">
                    <table className="adm-table" aria-label="Liste des utilisateurs">
                      <thead>
                        <tr><th>Utilisateur</th><th>Courriel</th><th>Rôle</th><th>Inscrit le</th></tr>
                      </thead>
                      <tbody>
                        {(users.length > 0 ? users : MOCK_USERS).map((u) => (
                          <tr key={u.id}>
                            <td style={{ display: 'flex', alignItems: 'center' }}>
                              <span className="tbl-avatar">{initials(u.prenom, u.nom)}</span>
                              <span style={{ fontWeight: 600 }}>{u.prenom} {u.nom}</span>
                            </td>
                            <td style={{ color: 'var(--muted)' }}>{u.courriel}</td>
                            <td>
                              <span className={`badge-admin ${u.role === 'admin' ? 'badge-err' : 'badge-info'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ color: 'var(--muted)' }}>
                              {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-CA') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ═══════════ MODAL Add/Edit ═══════════ */}
      {modal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }} role="dialog" aria-modal="true" aria-label={modal === 'add' ? 'Ajouter un ouvrage' : "Modifier l'ouvrage"}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid var(--border)' }}>
                <h5 className="modal-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {modal === 'add' ? '+ Ajouter un ouvrage' : `Modifier : ${editBook?.titre}`}
                </h5>
                <button type="button" className="btn-close" onClick={() => setModal(null)} aria-label="Fermer"></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  <div className="row g-3">
                    {[['titre', 'Titre *', 'text', true], ['auteur', 'Auteur *', 'text', true], ['prix', 'Prix ($) *', 'number', true], ['categorie', 'Catégorie *', 'text', true], ['stock', 'Stock *', 'number', true], ['image_url', "URL de l'image", 'url', false]].map(([key, label, type, required]) => (
                      <div className="col-md-6" key={key}>
                        <label className="form-label" style={{ fontWeight: 600, fontSize: '.87rem' }}>{label}</label>
                        <input type={type} className="form-control" value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required={required} min={type === 'number' ? 0 : undefined} step={key === 'prix' ? '0.01' : undefined} style={{ borderRadius: 10, borderColor: 'var(--border)' }} />
                      </div>
                    ))}
                    <div className="col-12">
                      <label className="form-label" style={{ fontWeight: 600, fontSize: '.87rem' }}>Description</label>
                      <textarea className="form-control" rows={4} value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ borderRadius: 10, borderColor: 'var(--border)', resize: 'none' }}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: '1px solid var(--border)' }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(null)}>Annuler</button>
                  <button type="submit" className="btn btn-terra" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement…</> : <><i className="bi bi-check2 me-1"></i>Enregistrer</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL Confirm Delete ═══════════ */}
      {confirmDelete && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }} role="alertdialog" aria-modal="true">
          <div className="modal-dialog modal-sm modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
              <div className="modal-body text-center p-4">
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fce8e3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <i className="bi bi-trash" style={{ fontSize: '1.5rem', color: 'var(--terracotta)' }}></i>
                </div>
                <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Confirmer la suppression</h5>
                <p style={{ fontSize: '.88rem', color: 'var(--muted)', marginTop: '.5rem' }}>
                  Supprimer <strong>« {confirmDelete.titre} »</strong> ? Action irréversible.
                </p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => setConfirmDelete(null)}>Annuler</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(confirmDelete.id)}>
                    <i className="bi bi-trash me-1"></i>Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
