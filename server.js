const express = require('express');
const next = require('next');
const r = require('rethinkdb');
const Redis = require('ioredis');
const pool = require('./utils/rethinkdb-pool');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const redis = new Redis({
  host: 'redis',
  port: 6379 
});

async function setupRethinkDB() {
  const conn = await pool.acquire();
  try {
    await r.dbCreate('test').run(conn);
  } catch (err) {
    console.log('Database already exists.');
  }
  try {
    await r.db('test').tableCreate('metrics').run(conn);
  } catch (err) {
    console.log('Table already exists.');
  }
  await pool.release(conn);
}

app.prepare().then(async () => {
  const server = express();

  await setupRethinkDB();

  server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  server.get('/api/metrics', async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const conn = await pool.acquire();
    const changeStream = await r.table('metrics')
      .changes({ includeInitial: true, includeTypes: true })
      .run(conn);

    changeStream.each((err, row) => {
      if (err) {
        console.error('Error in change stream:', err);
        return;
      }
      if (row.type === 'initial' || row.type === 'add' || row.type === 'change') {
        const data = JSON.stringify(row.new_val);
        res.write(`data: ${data}\n\n`);
      }
    });

    req.on('close', () => {
      changeStream.close();
      pool.release(conn);
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(5000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:5000');
  });
});