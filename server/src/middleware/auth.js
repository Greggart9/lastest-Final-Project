import jwt from 'jsonwebtoken';
import { findUserById } from '../db.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authorization token provided.' });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('[AUTH ERROR] JWT_SECRET environment variable is missing.');
    return res.status(500).json({ error: 'Server authentication configuration error.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Session has expired. Please sign in again.' });
      }
      return res.status(403).json({ error: 'Invalid or forged authentication token.' });
    }

    const user = findUserById(decoded.userId);
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
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    return next();
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (!err && decoded && decoded.userId) {
      const user = findUserById(decoded.userId);
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        req.user = safeUser;
      }
    }
    next();
  });
}
