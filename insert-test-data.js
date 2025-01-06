const r = require('rethinkdb');
const os = require('os-utils');

async function waitForDatabase(maxAttempts = 30, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const conn = await r.connect({ host: 'rethinkdb', port: 28015, db: 'test' });
      await r.dbList().run(conn);
      console.log('Successfully connected to RethinkDB');
      conn.close();
      return;
    } catch (err) {
      console.log(`Attempt ${attempt}: RethinkDB not ready, retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Failed to connect to RethinkDB after multiple attempts');
}

function getCPUUsage() {
  return new Promise((resolve) => {
    os.cpuUsage((value) => {
      resolve(value * 100);
    });
  });
}

async function insertCPUData() {
  try {
    await waitForDatabase();
    
    const connection = await r.connect({ host: 'rethinkdb', port: 28015, db: 'test' });
    console.log('Connected to RethinkDB');

    setInterval(async () => {
      try {
        const cpuUsage = await getCPUUsage();
        const result = await r.table('metrics').insert({
          timestamp: new Date(),
          metric_name: "CPU Usage",
          metric_value: cpuUsage
        }).run(connection);
        console.log('Inserted CPU data:', result);
      } catch (err) {
        console.error('Error inserting data:', err);
      }
    }, 1000);

  } catch (err) {
    console.error('Error:', err);
  }
}

insertCPUData();