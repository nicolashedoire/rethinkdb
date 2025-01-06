const r = require('rethinkdb');
const genericPool = require('generic-pool');

const factory = {
  create: async () => {
    return await r.connect({ host: 'rethinkdb', port: 28015, db: 'test' });
  },
  destroy: (connection) => {
    return connection.close();
  }
};

const opts = {
  max: 10,
  min: 2
};

const pool = genericPool.createPool(factory, opts);

module.exports = pool;