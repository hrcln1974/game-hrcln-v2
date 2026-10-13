import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const distPath = path.join(__dirname, 'dist');

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'game-hrcln-v2', status: 'healthy' });
});
app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'game-hrcln-v2', status: 'healthy' });
});

app.use(express.static(distPath, {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  etag: true,
  index: false,
}));

// React Router / client-side navigation fallback (Express 4 compatible).
app.get('*', (req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

app.use((err, _req, res, _next) => {
  console.error('[server]', err?.message || err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

app.listen(PORT, HOST, () => {
  console.log(`[game-hrcln-v2] listening on http://${HOST}:${PORT}`);
});
