// fix-passwords.js — Run once to fix password hashes in DB
// Usage: node fix-passwords.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql  = require('mysql2/promise');

async function main() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'livresgourmands',
  });

  const hash = await bcrypt.hash('password123', 10);
  console.log('Hash généré:', hash);

  await db.query('UPDATE users SET password_hash = ?', [hash]);
  const [rows] = await db.query('SELECT id, email, role FROM users');
  console.log('\n✅ Mots de passe mis à jour pour:');
  rows.forEach(u => console.log(`  - ${u.email} (${u.role})`));

  await db.end();
  console.log('\nDone! Lance: node test.js\n');
}

main().catch(console.error);