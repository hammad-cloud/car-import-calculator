import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// /api is served by FastAPI (uvicorn on :8000 locally, a Python function on Vercel).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true, // expose on the local network so a phone on the same Wi-Fi can open it
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
});
