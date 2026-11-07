import jwt from 'jsonwebtoken';
import { findUserById } from '../db.js';
import { supabaseFindUserById, isSupabaseConfigured } from '../db/supabase.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'campushub_jwt_secret_dev_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session has expired. Please sign in again.' });
      }
      return res.status(403).json({ error: 'Invalid or forged authentication token.' });
    }

    let user = null;
    if (isSupabaseConfigured() && decoded?.userId) {
      try {
        user = await supabaseFindUserById(decoded.userId);
      } catch {}
    }
    if (!user && decoded?.userId) {
      user = findUserById(decoded.userId);
    }

    if (!user) {
      return res.status(401).json({ error: 'User associated with this token no longer exists.' });
    }

    // Attach sanitized user to request
    const { passwordHash: _, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }

  next();
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (!err && decoded && decoded.userId) {
      let user = null;
      if (isSupabaseConfigured()) {
        try {
          user = await supabaseFindUserById(decoded.userId);
        } catch {}
      }
      if (!user) {
        user = findUserById(decoded.userId);
      }
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        req.user = safeUser;
      }
    }
    next();
  });
}
