const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'akreditame-simulador-secret-key-2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const parts = authHeader.split(' ');
  const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : (parts.length === 1 ? parts[0] : null);

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
  }
  next();
}

function createSimulatorRouter(pool) {
  const router = express.Router();

  // POST /login - Autenticación de usuarios
  router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
      const normalizedEmail = String(email).trim().toLowerCase();
      const result = await pool.query(
        'SELECT id, email, password_hash, name, role, is_active FROM simulator_users WHERE LOWER(email) = LOWER($1)',
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
      }

      const user = result.rows[0];

      if (!user.is_active) {
        return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
      }

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

      return res.status(200).json({
        success: true,
        token,
        user: payload,
      });
    } catch (err) {
      console.error('[simulator-login-error]', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  // GET /verify - Verificación del estado de la sesión
  router.get('/verify', authenticateToken, (req, res) => {
    return res.status(200).json({
      valid: true,
      user: req.user,
    });
  });

  // GET /admin/users - Listar usuarios (solo admin)
  router.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, name, role, is_active, created_at, updated_at FROM simulator_users ORDER BY created_at DESC'
      );
      return res.status(200).json({ users: result.rows });
    } catch (err) {
      console.error('[simulator-admin-users-get-error]', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  // POST /admin/users - Registrar nuevo usuario (solo admin)
  router.post('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    const { email, password, name, role } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    try {
      const normalizedEmail = String(email).trim().toLowerCase();
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const userRole = role === 'admin' ? 'admin' : 'user';

      const result = await pool.query(
        `INSERT INTO simulator_users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, is_active, created_at, updated_at`,
        [normalizedEmail, passwordHash, name ? String(name).trim() : null, userRole]
      );

      return res.status(201).json({
        success: true,
        user: result.rows[0],
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado' });
      }
      console.error('[simulator-admin-users-create-error]', err);
      return res.status(500).json({ error: 'Error al crear usuario' });
    }
  });

  // PATCH /admin/users/:id - Actualizar usuario (solo admin)
  router.patch('/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, is_active, password, role } = req.body || {};

    try {
      const checkRes = await pool.query('SELECT id FROM simulator_users WHERE id = $1', [id]);
      if (checkRes.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const updates = [];
      const values = [];
      let index = 1;

      if (name !== undefined) {
        updates.push(`name = $${index++}`);
        values.push(name ? String(name).trim() : null);
      }
      if (is_active !== undefined) {
        updates.push(`is_active = $${index++}`);
        values.push(Boolean(is_active));
      }
      if (role !== undefined) {
        const userRole = role === 'admin' ? 'admin' : 'user';
        updates.push(`role = $${index++}`);
        values.push(userRole);
      }
      if (password !== undefined && String(password).trim() !== '') {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(String(password), saltRounds);
        updates.push(`password_hash = $${index++}`);
        values.push(passwordHash);
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');

      values.push(id);
      const query = `
        UPDATE simulator_users
        SET ${updates.join(', ')}
        WHERE id = $${index}
        RETURNING id, email, name, role, is_active, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return res.status(200).json({
        success: true,
        user: result.rows[0],
      });
    } catch (err) {
      console.error('[simulator-admin-users-patch-error]', err);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  });

  // DELETE /admin/users/:id - Eliminar usuario (solo admin)
  router.delete('/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;

    if (req.user && String(req.user.id) === String(id)) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta de administrador' });
    }

    try {
      const result = await pool.query('DELETE FROM simulator_users WHERE id = $1 RETURNING id', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
      });
    } catch (err) {
      console.error('[simulator-admin-users-delete-error]', err);
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  });

  return router;
}

createSimulatorRouter.authenticateToken = authenticateToken;
createSimulatorRouter.requireAdmin = requireAdmin;
createSimulatorRouter.JWT_SECRET = JWT_SECRET;

module.exports = createSimulatorRouter;
