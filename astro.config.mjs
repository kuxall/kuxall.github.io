import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), sitemap()],
  site: 'https://kuxall.github.io',
  output: 'static',
  build: {
    assets: '_astro'
  }
});
