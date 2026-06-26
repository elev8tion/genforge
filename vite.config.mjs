import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        // No proxy needed — providers are called directly
    }
});
