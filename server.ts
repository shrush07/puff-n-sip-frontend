import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import 'localstorage-polyfill';
import AppServerModule from './src/main.server';
import proxy from 'express-http-proxy'; 
import WebSocket from 'ws';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Determine backend URL based on environment
  const backendUrl = process.env.NODE_ENV === 'production'
    ? 'https://puff-sip.onrender.com'  
    : 'http://localhost:5000';  

  console.log(`Proxying API requests to: ${backendUrl}`);
  server.use('/api', proxy(backendUrl));

  

  // Middleware for CORS and JSON parsing
  server.use(express.json());
  
  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    })
  );

  // Websocket closure
  const wsClient = new WebSocket(
  process.env.NODE_ENV === 'production'
    ? 'wss://puff-sip.onrender.com'
    : 'ws://localhost:5000'
);
  wsClient.on('open', () => {
    console.log('WebSocket client connected to ws://localhost:5000');
    wsClient.close(1000, 'Normal Closure');
  });
  
  wsClient.on('close', (code, reason) => {
    console.log(`WebSocket closed with code ${code}, reason: ${reason}`);
  });
  
  wsClient.on('error', (err) => {
    console.error('WebSocket error:', err);
  });

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  // Error handling middleware
  server.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();