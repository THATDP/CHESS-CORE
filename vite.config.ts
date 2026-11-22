import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Assets remain relative to the HTML, whether Pages serves a repository or a root site.
  base: './',
  plugins: [react()],
  test: { environment: 'jsdom', include: ['tests/**/*.test.{ts,tsx}'] },
});
