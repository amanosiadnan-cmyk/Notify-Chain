import http from 'http';
import { eventRegistry } from '../store/event-registry';
import logger from '../utils/logger';

export interface EventsServerOptions {
  port: number;
  corsOrigin?: string;
}

export function createEventsServer(options: EventsServerOptions): http.Server {
  const corsOrigin = options.corsOrigin ?? 'http://localhost:5173';

  return http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/events')) {
      const url = new URL(req.url, 'http://localhost');
      const limitParam = url.searchParams.get('limit');
      const limit = limitParam ? parseInt(limitParam, 10) : undefined;
      const events =
        limit !== undefined && !Number.isNaN(limit)
          ? eventRegistry.getEvents(limit)
          : eventRegistry.getEvents();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          count: eventRegistry.count(),
          events,
        })
      );
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

export function startEventsServer(options: EventsServerOptions): http.Server {
  const server = createEventsServer(options);
  server.listen(options.port, () => {
    logger.info('Events API server listening', { port: options.port });
  });
  return server;
}
