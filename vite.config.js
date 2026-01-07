import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeContentFile } from './scripts/generate-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), contentEditorPlugin()],
});

function contentEditorPlugin() {
  const dataPath = path.resolve(__dirname, 'content.data.json');
  const backupDir = path.resolve(__dirname, 'content.backups');

  const sendJson = (res, statusCode, payload) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };

  const readBody = (req) =>
    new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => resolve(body));
      req.on('error', reject);
    });

  const writeBackup = () => {
    if (!fs.existsSync(dataPath)) return;
    fs.mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `content.${stamp}.json`);
    fs.copyFileSync(dataPath, backupPath);
  };

  return {
    name: 'content-editor',
    configureServer(server) {
      server.middlewares.use('/__editor/content', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            return sendJson(res, 200, data);
          } catch (err) {
            return sendJson(res, 500, { error: 'Failed to read content.data.json' });
          }
        }

        if (req.method === 'PUT') {
          try {
            const rawBody = await readBody(req);
            const data = JSON.parse(rawBody);
            writeBackup();
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
            writeContentFile(data);
            return sendJson(res, 200, { ok: true, savedAt: new Date().toISOString() });
          } catch (err) {
            return sendJson(res, 400, { error: 'Failed to save content data' });
          }
        }

        return next();
      });
    },
  };
}
