import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
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
                  process.env.OPENROUTER_API_KEY = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
                  process.env.OPENROUTER_MODEL = env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL;
                  const { handler } = await import('./netlify/functions/chat.js');
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
        }
      }
    ],
  };
});
