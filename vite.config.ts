// FILE: vite.config.ts

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Load env vars from .env, .env.[mode], etc.
  const env = loadEnv(mode, process.cwd(), '');

  const GEMINI_API_KEY = env.GEMINI_API_KEY ?? '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Allow using process.env.GEMINI_API_KEY and process.env.API_KEY in client code.
      'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_API_KEY),
      'process.env.API_KEY': JSON.stringify(GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
