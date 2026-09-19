import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

import path from 'path';
import { pathToFileURL } from 'url';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const catalogFunctionUrl = pathToFileURL(path.resolve(process.cwd(), 'netlify/functions/catalog.js')).href;
  const chatFunctionUrl = pathToFileURL(path.resolve(process.cwd(), 'netlify/functions/chat.js')).href;

  return {
    plugins: [
      react(),
      {
        name: 'local-api-chat',
        configureServer(server) {
          const handleChat = async (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const currentEnv = loadEnv(mode, process.cwd(), '');
                  process.env.OPENROUTER_API_KEY = currentEnv.OPENROUTER_API_KEY || currentEnv.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
                  process.env.OPENROUTER_MODEL = currentEnv.OPENROUTER_MODEL || currentEnv.VITE_OPENROUTER_MODEL || 'openai/gpt-5.6-luna';
                  const validSheetId = (currentEnv.GOOGLE_SHEET_ID || currentEnv.VITE_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID || "1_lfhNXffYfXKOXXTlk8wjel0veAn8zvnZ8kB2ktd-Xc").trim();
                  process.env.GOOGLE_SHEET_ID = validSheetId !== "undefined" ? validSheetId : "1_lfhNXffYfXKOXXTlk8wjel0veAn8zvnZ8kB2ktd-Xc";
                  const { handler } = await import(`${chatFunctionUrl}?update=${Date.now()}`);
                  const result = await handler({
                    httpMethod: 'POST',
                    body
                  });
                  res.statusCode = result.statusCode || 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(result.body);
                } catch (e) {
                  console.error('Local chat error:', e);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: e.message }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
            }
          };

          server.middlewares.use('/.netlify/functions/chat', handleChat);
          server.middlewares.use('/api/chat', handleChat);

          const handleCatalog = async (req, res) => {
            try {
              const currentEnv = loadEnv(mode, process.cwd(), '');
              const validSheetId = (currentEnv.GOOGLE_SHEET_ID || currentEnv.VITE_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID || "1_lfhNXffYfXKOXXTlk8wjel0veAn8zvnZ8kB2ktd-Xc").trim();
              process.env.GOOGLE_SHEET_ID = validSheetId !== "undefined" ? validSheetId : "1_lfhNXffYfXKOXXTlk8wjel0veAn8zvnZ8kB2ktd-Xc";
              const validAppsScriptUrl = (currentEnv.GOOGLE_APPS_SCRIPT_URL || currentEnv.VITE_GOOGLE_APPS_SCRIPT_URL || process.env.GOOGLE_APPS_SCRIPT_URL || "").trim();
              process.env.GOOGLE_APPS_SCRIPT_URL = validAppsScriptUrl !== "undefined" ? validAppsScriptUrl : "";
              const { handler } = await import(`${catalogFunctionUrl}?update=${Date.now()}`);
              const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
              const queryParams = Object.fromEntries(url.searchParams.entries());
              const result = await handler({
                httpMethod: req.method,
                queryStringParameters: queryParams
              });
              res.statusCode = result.statusCode || 200;
              if (result.headers) {
                Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
              } else {
                res.setHeader('Content-Type', 'application/json');
              }
              res.end(result.body);
            } catch (e) {
              console.error('Local catalog error:', e);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e.message }));
            }
          };

          server.middlewares.use('/.netlify/functions/catalog', handleCatalog);
          server.middlewares.use('/api/catalog', handleCatalog);
        }
      }
    ],
  };
});
