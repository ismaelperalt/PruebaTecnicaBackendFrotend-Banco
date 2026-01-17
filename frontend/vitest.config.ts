/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                  // permite usar test/expect sin importarlos
    environment: 'jsdom',           // necesario para tests de React
    setupFiles: './src/setupTests.ts', // importa jest-dom
    coverage: {
        reporter: ['text', 'lcov'],
    },
  },
});
