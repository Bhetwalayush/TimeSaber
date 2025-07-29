
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [

    react(),
    tailwindcss(),
  ],
  server: {
    host:'0.0.0.0',
    port: 5000,
     https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  },
})
