import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listenOnAvailablePort(app: express.Express, preferredPort: number) {
  const portsToTry = Array.from(new Set([preferredPort, 3001, 3002, 3003, 4000, 4001, 5000, 8080, 9000]));
  let portIndex = 0;

  const attemptListen = () => {
    const port = portsToTry[portIndex];
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`[Server] Modern Barbershop by Karl running on http://0.0.0.0:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE' && portIndex < portsToTry.length - 1) {
        portIndex += 1;
        console.warn(`[Server] Port ${port} is in use. Retrying on ${portsToTry[portIndex]}...`);
        attemptListen();
        return;
      }

      console.error('[Server] Failed to start server:', error);
      process.exit(1);
    });
  };

  attemptListen();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', shop: 'Modern Barbershop by Karl' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  listenOnAvailablePort(app, PORT);
}

startServer();
