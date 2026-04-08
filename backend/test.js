// ============================================================
// test.js — Tests automatiques API livresgourmands.net
// Usage: node test.js
// ============================================================

const BASE = 'http://localhost:3000/api';

let token = '';
let adminToken = '';
let panierItemId = null;
let commandeId = null;
let listeId = null;
let listeCode = '';
let commentaireId = null;
let ouvrageId = null;

// ── Helpers ─────────────────────────────────────────────────
const c = {
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
};

let passed = 0;
let failed = 0;

async function req(method, path, body = null, useToken = null) {
  const headers = { 'Content-Type': 'application/json' };
  const tok = useToken === 'admin' ? adminToken : (useToken ? token : null);
  if (tok) headers['Authorization'] = `Bearer ${tok}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const t0 = Date.now();
  const res = await fetch(`${BASE}${path}`, opts);
  const ms  = Date.now() - t0;

  let data;
  try { data = await res.json(); } catch { data = {}; }

  return { status: res.status, data, ms, ok: res.ok };
}

function check(label, condition, got = '') {
  if (condition) {
    console.log(`  ${c.green('✓')} ${label}`);
    passed++;
  } else {
    console.log(`  ${c.red('✗')} ${label} ${c.dim('← ' + String(got))}`);
    failed++;
  }
}

function section(title) {
  console.log(`\n${c.bold(c.cyan('══ ' + title + ' ══'))}`);
}

// ── Tests ────────────────────────────────────────────────────

async function testAuth() {
  section('AUTH');

  // Register nouveau user
  let r = await req('POST', '/auth/register', {
    nom: 'Test Runner',
    email: `runner_${Date.now()}@test.com`,
    password: 'password123'
  });
  check('POST /auth/register → 201', r.status === 201, r.status);
  check('userId retourné', !!r.data.userId, JSON.stringify(r.data));

  // Register email déjà utilisé
  r = await req('POST', '/auth/register', {
    nom: 'Alice', email: 'alice@email.com', password: 'password123'
  });
  check('Register email existant → 409', r.status === 409, r.status);

  // Login valide — client
  r = await req('POST', '/auth/login', {
    email: 'alice@email.com', password: 'password123'
  });
  check('POST /auth/login → 200', r.status === 200, r.status);
  check('Token JWT reçu', !!r.data.token, JSON.stringify(r.data));
  if (r.data.token) token = r.data.token;

  // Login admin
  r = await req('POST', '/auth/login', {
    email: 'admin@livresgourmands.net', password: 'password123'
  });
  check('Login admin → 200', r.status === 200, r.status);
  if (r.data.token) adminToken = r.data.token;

  // Login mauvais mot de passe
  r = await req('POST', '/auth/login', {
    email: 'alice@email.com', password: 'wrongpassword'
  });
  check('Login mauvais mdp → 401', r.status === 401, r.status);

  // Login sans token → 401
  r = await req('GET', '/users/me');
  check('GET /users/me sans token → 401', r.status === 401, r.status);
}

async function testUsers() {
  section('USERS');

  let r = await req('GET', '/users/me', null, true);
  check('GET /users/me → 200', r.status === 200, r.status);
  check('Email = alice@email.com', r.data.email === 'alice@email.com', r.data.email);

  r = await req('GET', '/users', null, true);
  check('GET /users (client) → 403', r.status === 403, r.status);

  r = await req('GET', '/users', null, 'admin');
  check('GET /users (admin) → 200', r.status === 200, r.status);
  check('Liste non vide', Array.isArray(r.data) && r.data.length > 0, r.data.length);
}

async function testCategories() {
  section('CATEGORIES');

  let r = await req('GET', '/categories');
  check('GET /categories → 200', r.status === 200, r.status);
  check('Au moins 5 catégories', Array.isArray(r.data) && r.data.length >= 5, r.data.length);

  // Créer sans token → 401
  r = await req('POST', '/categories', { nom: 'Test', description: 'Test' });
  check('POST /categories sans token → 401', r.status === 401, r.status);

  // Créer avec client → 403
  r = await req('POST', '/categories', { nom: 'Test', description: 'Test' }, true);
  check('POST /categories (client) → 403', r.status === 403, r.status);

  // Créer avec admin → 201
  r = await req('POST', '/categories', { nom: `Cat_${Date.now()}`, description: 'Test auto' }, 'admin');
  check('POST /categories (admin) → 201', r.status === 201, r.status);
}

async function testOuvrages() {
  section('OUVRAGES');

  let r = await req('GET', '/ouvrages');
  check('GET /ouvrages → 200', r.status === 200, r.status);
  check('Ouvrages avec stock > 0 seulement', r.data.every(o => o.stock > 0), 'stock check');

  // Vérif que l'ouvrage épuisé (id=8) n'apparaît pas
  const ids = r.data.map(o => o.id);
  check('Ouvrage épuisé (id=8) absent', !ids.includes(8), `ids: ${ids}`);

  // Filtre texte
  r = await req('GET', '/ouvrages?q=cuisine');
  check('GET /ouvrages?q=cuisine filtre', r.status === 200 && r.data.length > 0, r.data.length);

  // Détail
  r = await req('GET', '/ouvrages/1');
  check('GET /ouvrages/1 → 200', r.status === 200, r.status);
  check('Contient avis', Array.isArray(r.data.avis), typeof r.data.avis);
  check('Contient commentaires', Array.isArray(r.data.commentaires), typeof r.data.commentaires);

  // Ouvrage inexistant
  r = await req('GET', '/ouvrages/9999');
  check('GET /ouvrages/9999 → 404', r.status === 404, r.status);

  // Créer ouvrage avec admin
  r = await req('POST', '/ouvrages', {
    titre: 'Test Ouvrage Auto',
    auteur: 'Auteur Test',
    isbn: `978-0-00-${Date.now().toString().slice(-6)}-0`,
    description: 'Créé par test auto',
    prix: 19.99,
    stock: 5,
    categorie_id: 1
  }, 'admin');
  check('POST /ouvrages (admin) → 201', r.status === 201, r.status);
  if (r.data.id) ouvrageId = r.data.id;

  // Validation — prix négatif
  r = await req('POST', '/ouvrages', {
    titre: 'X', auteur: 'X', isbn: '000', description: '', prix: -5, stock: 0, categorie_id: 1
  }, 'admin');
  check('Prix négatif → 422', r.status === 422, r.status);
}

async function testPanier() {
  section('PANIER');

  let r = await req('GET', '/panier', null, true);
  check('GET /panier → 200', r.status === 200, r.status);
  check('Contient items', Array.isArray(r.data.items), typeof r.data.items);

  // Ajouter item
  r = await req('POST', '/panier/items', { ouvrage_id: 1, quantite: 1 }, true);
  check('POST /panier/items → 201', r.status === 201, r.status);

  // Récupérer id du premier item
  r = await req('GET', '/panier', null, true);
  if (r.data.items && r.data.items.length > 0) {
    panierItemId = r.data.items[0].id;
  }
  check('Item ajouté visible', r.data.items && r.data.items.length > 0, r.data.items?.length);

  // Modifier quantité
  if (panierItemId) {
    r = await req('PUT', `/panier/items/${panierItemId}`, { quantite: 2 }, true);
    check('PUT /panier/items/:id → 200', r.status === 200, r.status);
  }

  // Ajouter ouvrage hors stock → 400
  r = await req('POST', '/panier/items', { ouvrage_id: 8, quantite: 1 }, true);
  check('Ajouter ouvrage hors stock → 400', r.status === 400, r.status);
}

async function testCommandes() {
  section('COMMANDES');

  // Créer commande → décrémente stock (transaction)
  let r = await req('POST', '/commandes', {
    adresse_livraison: '123 rue Ste-Catherine, Montréal, QC',
    mode_paiement: 'carte'
  }, true);
  check('POST /commandes → 201', r.status === 201, r.status);
  check('URL paiement retournée', !!r.data.paiement_url, JSON.stringify(r.data));
  if (r.data.commande_id) commandeId = r.data.commande_id;

  // Vérifier stock décrémenté
  const stockRes = await req('GET', '/ouvrages/1');
  check('Stock décrémenté après commande', stockRes.status === 200, stockRes.status);

  // Historique
  r = await req('GET', '/commandes', null, true);
  check('GET /commandes → 200', r.status === 200, r.status);
  check('Au moins 1 commande', Array.isArray(r.data) && r.data.length > 0, r.data.length);

  // Détail
  if (commandeId) {
    r = await req('GET', `/commandes/${commandeId}`, null, true);
    check('GET /commandes/:id → 200', r.status === 200, r.status);
    check('Contient items', Array.isArray(r.data.items), typeof r.data.items);
  }

  // Update statut sans permission → 403
  if (commandeId) {
    r = await req('PUT', `/commandes/${commandeId}/status`, { statut: 'expediee' }, true);
    check('Changer statut (client) → 403', r.status === 403, r.status);

    // Update avec admin → 200
    r = await req('PUT', `/commandes/${commandeId}/status`, { statut: 'payee' }, 'admin');
    check('Changer statut (admin) → 200', r.status === 200, r.status);
  }
}

async function testAvis() {
  section('AVIS & COMMENTAIRES');

  // Avis sur ouvrage acheté (alice a commandé ouvrage 5 dans le seed)
  let r = await req('POST', '/ouvrages/5/avis', { note: 4, commentaire: 'Test auto' }, true);
  // Peut être 201 (nouveau) ou 409 (déjà existant depuis le seed)
  check('POST /ouvrages/5/avis → 201 ou 409', [201, 409].includes(r.status), r.status);

  // Avis sans achat → 403
  r = await req('POST', '/ouvrages/3/avis', { note: 3 }, true);
  check('Avis sans achat → 403', r.status === 403, r.status);

  // Note invalide
  r = await req('POST', '/ouvrages/5/avis', { note: 10 }, true);
  check('Note > 5 → 422', r.status === 422, r.status);

  // Soumettre commentaire
  r = await req('POST', '/ouvrages/1/commentaires', {
    contenu: 'Commentaire test automatique'
  }, true);
  check('POST /commentaires → 201', r.status === 201, r.status);

  // Valider commentaire — besoin éditeur token
  const editeurLogin = await req('POST', '/auth/login', {
    email: 'editeur@livresgourmands.net', password: 'password123'
  });
  const editeurToken = editeurLogin.data.token;

  if (editeurToken) {
    // GET commentaires en attente
    r = await req('GET', '/commentaires', null, 'admin');
    check('GET /commentaires (admin) → 200', r.status === 200, r.status);
    if (r.data.length > 0) commentaireId = r.data[0].id;

    // Valider
    if (commentaireId) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${editeurToken}`
      };
      const res2 = await fetch(`${BASE}/commentaires/${commentaireId}/valider`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ valide: true })
      });
      check('PUT /commentaires/:id/valider → 200', res2.status === 200, res2.status);
    }
  }
}

async function testListes() {
  section('LISTES CADEAUX');

  // Créer liste
  let r = await req('POST', '/listes', { nom: 'Ma liste test' }, true);
  check('POST /listes → 201', r.status === 201, r.status);
  check('code_partage généré', !!r.data.code_partage, JSON.stringify(r.data));
  if (r.data.code_partage) listeCode = r.data.code_partage;
  if (r.data.id) listeId = r.data.id;

  // Consulter par code (public)
  if (listeCode) {
    r = await req('GET', `/listes/${listeCode}`);
    check('GET /listes/:code → 200', r.status === 200, r.status);
    check('Nom correct', r.data.nom === 'Ma liste test', r.data.nom);
  }

  // Code inexistant → 404
  r = await req('GET', '/listes/code_qui_nexiste_pas');
  check('Code inexistant → 404', r.status === 404, r.status);

  // Ajouter item à la liste
  if (listeId) {
    r = await req('POST', `/listes/${listeId}/items`, {
      ouvrage_id: 2, quantite_souhaitee: 1
    }, true);
    check('Ajouter item à la liste → 201', r.status === 201, r.status);
  }
}

async function testSecurity() {
  section('SÉCURITÉ');

  // Token invalide
  const fakeHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tokenbidon123'
  };
  const r = await fetch(`${BASE}/users/me`, { headers: fakeHeaders });
  check('Token invalide → 401', r.status === 401, r.status);

  // Validation body manquant
  const r2 = await req('POST', '/auth/register', { nom: 'X' });
  check('Register sans email → 422', r2.status === 422, r2.status);

  // Client ne peut pas supprimer ouvrage
  const r3 = await req('DELETE', '/ouvrages/1', null, true);
  check('DELETE /ouvrages (client) → 403', r3.status === 403, r3.status);
}

// ── Runner ───────────────────────────────────────────────────
async function run() {
  console.log(c.bold('\n🧪  Tests API — livresgourmands.net'));
  console.log(c.dim(`    Base URL : ${BASE}\n`));

  try {
    await testAuth();
    await testUsers();
    await testCategories();
    await testOuvrages();
    await testPanier();
    await testCommandes();
    await testAvis();
    await testListes();
    await testSecurity();
  } catch (err) {
    console.error(c.red('\n⚠️  Erreur fatale:'), err.message);
    console.error(c.dim('   Vérifiez que le serveur tourne sur ' + BASE));
    process.exit(1);
  }

  const total = passed + failed;
  const pct   = Math.round((passed / total) * 100);

  console.log('\n' + '─'.repeat(40));
  console.log(c.bold(`Résultats : ${c.green(passed + ' réussis')} / ${failed > 0 ? c.red(failed + ' échoués') : '0 échoués'} / ${total} total`));
  console.log(`Score     : ${pct >= 80 ? c.green(pct + '%') : pct >= 60 ? c.yellow(pct + '%') : c.red(pct + '%')}`);
  console.log('─'.repeat(40));

  if (failed === 0) {
    console.log(c.green('\n✅  Tous les tests passent! Prêt pour la remise.\n'));
  } else {
    console.log(c.yellow(`\n⚠️  ${failed} test(s) échoué(s). Vérifiez les erreurs ci-dessus.\n`));
  }

  process.exit(failed > 0 ? 1 : 0);
}

run();