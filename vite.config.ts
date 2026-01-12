import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Permet de conserver l'accès à process.env.API_KEY comme dans le code actuel
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  }
});