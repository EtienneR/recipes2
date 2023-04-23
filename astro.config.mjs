import { defineConfig } from 'astro/config';

// https://astro.build/config
import vue from "@astrojs/vue";
import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://etienner.github.io',
  base: '/recipes2',
  integrations: [vue(),
  AstroPWA
    ({
      mode: 'development',
      base: '/recipes2/',
      includeAssets: ['favicon.svg'],
      registerType: 'autoUpdate',
      manifest: {
        id: '/recipes2/',
        name: 'Astro PWA',
        short_name: 'Astro PWA',
        lang: 'fr',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallback: '/404',
      },
    }),
  ]
});