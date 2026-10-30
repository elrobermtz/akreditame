const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const ADMIN_EMAIL = 'roberto.martinez@akredita.me';
const ADMIN_PASSWORD = 'Temporal12345!!';
const ADMIN_NAME = 'Roberto Martinez';
const ADMIN_ROLE = 'admin';

async function ensureAdminUser(pool) {
  if (!pool) {
    throw new Error('A valid PostgreSQL pool instance must be provided to ensureAdminUser.');
  }

  // 1. Ensure required table exists
  await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS simulator_users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Check if master admin already exists
  const existingRes = await pool.query(
    'SELECT id, email, role, is_active FROM simulator_users WHERE email = $1',
    [ADMIN_EMAIL]
  );

  if (existingRes.rows.length > 0) {
    const existing = existingRes.rows[0];
    console.log(`[seed-admin] Master admin already exists: ${existing.email} (role: ${existing.role})`);
    return existing;
  }

  // 3. Hash password and insert master admin
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

  const insertRes = await pool.query(
    `INSERT INTO simulator_users (email, password_hash, name, role, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, name, role, is_active, created_at`,
    [ADMIN_EMAIL, passwordHash, ADMIN_NAME, ADMIN_ROLE, true]
  );

  const admin = insertRes.rows[0];
  console.log(`[seed-admin] Master admin successfully created: ${admin.email} (id: ${admin.id})`);
  return admin;
}

if (require.main === module) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('[seed-admin] DATABASE_URL environment variable is not defined.');
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  ensureAdminUser(pool)
    .then(() => {
      console.log('[seed-admin] Seeding process completed successfully.');
      return pool.end();
    })
    .catch((err) => {
      console.error('[seed-admin] Error seeding admin user:', err);
      pool.end().finally(() => process.exit(1));
    });
}

module.exports = {
  ensureAdminUser,
  ADMIN_EMAIL,
  ADMIN_NAME,
  ADMIN_ROLE,
};

