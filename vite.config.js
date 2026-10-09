import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFile } from 'node:fs/promises';
import { renderPage } from './src/app/render-page.js';
import { legacyDestination } from './src/app/routes.js';
import { escapeHtml } from './src/components/primitives.js';
import { appPath, siteUrl } from './src/app/hosting.js';

function routeDocuments() {
  function install(server, development) {
    server.middlewares.use(async (request, response, next) => {
      if (!['GET', 'HEAD'].includes(request.method) || !request.headers.accept?.includes('text/html')) return next();
      const path = appPath(new URL(request.url, 'http://localhost').pathname);
      const redirect = legacyDestination(path);
      if (redirect) {
        response.writeHead(301, { Location: siteUrl(redirect) });
        return response.end();
      }
      // Asset requests and independent design artifacts stay with Vite's file server.
      if (/\.[a-z0-9]+$/i.test(path)) return next();
      try {
        const template = await readFile(new URL(development ? './index.html' : './dist/app-shell.html', import.meta.url), 'utf8');
        const view = renderPage(path, { development });
        let html = template.replace('<!--page-content-->', view.html)
          .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(view.title)} · WeGroween</title>`)
          .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(view.description)}">`);
        if (development) html = await server.transformIndexHtml(request.url, html);
        response.writeHead(view.status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        response.end(request.method === 'HEAD' ? undefined : html);
      } catch (error) { next(error); }
    });
  }
  return {
    name: 'wegroween-route-documents',
    configureServer(server) { install(server, true); },
    configurePreviewServer(server) { install(server, false); },
  };
}

export default defineConfig({
  base: process.env.WEGROWEEN_BASE_PATH || '/',
  plugins: [tailwindcss(), routeDocuments()],
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { target: 'es2022', outDir: 'dist', emptyOutDir: true },
});
