import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [tailwind()],
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:fs']
    }
  },
  site: 'https://sarlab.pro',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
