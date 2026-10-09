import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { basePath, appPath, isSitePath } from '../src/app/hosting.js';

const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!isSitePath(pathname)) { response.writeHead(404); return response.end(); }
    let file = resolve(root, `.${appPath(pathname)}`);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(404); return response.end(); }
    let status = 200;
    try { if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html'); await stat(file); }
    catch { status = 404; file = resolve(root, '404.html'); }
    const body = await readFile(file);
    response.writeHead(status, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(400); response.end(); }
}).listen(4183, '127.0.0.1', () => console.log(`Static Pages preview: http://127.0.0.1:4183${basePath}`));
