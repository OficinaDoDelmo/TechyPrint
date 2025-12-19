import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente ignorando prefixos para compatibilidade total
  // Fix: Property 'cwd' does not exist on type 'Process'. Using type assertion to access cwd() in Node context.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    server: {
      host: true
    },
    define: {
      // Injeta a API_KEY diretamente no bundle durante o build da Vercel
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});