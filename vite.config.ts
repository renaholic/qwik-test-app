import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { qwikSpeakInline } from 'qwik-speak/inline';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'Qwik Fucking Around',
          short_name: 'Aleph QFA',
          description: 'Messing around qwik',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'favicon.svg',
              sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
      }),
      qwikCity(),
      qwikVite(),
      qwikSpeakInline({
        supportedLangs: ['en-US', 'zh-HK'],
        defaultLang: 'en-US',
      }),
      tsconfigPaths(),
    ],
  };
});
