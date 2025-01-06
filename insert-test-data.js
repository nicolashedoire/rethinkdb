const r = require('rethinkdb');

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

function generateVitalSigns() {
  return {
    heartRate: 75 + (Math.random() * 10 - 5),              // 70-80 bpm
    bloodPressure: {
      systolic: 120 + (Math.random() * 10 - 5),            // 115-125 mmHg
      diastolic: 80 + (Math.random() * 10 - 5)             // 75-85 mmHg
    },
    temperature: 37 + (Math.random() * 0.4 - 0.2),         // 36.8-37.2°C
    oxygenLevel: 98 + (Math.random() * 2 - 1),             // 97-99%
    respiratoryRate: 16 + (Math.random() * 4 - 2)          // 14-18 /min
  };
}

async function insertMedicalData() {
  try {
    await waitForDatabase();
    
    const connection = await r.connect({ host: 'rethinkdb', port: 28015, db: 'test' });
    console.log('Connected to RethinkDB');

    setInterval(async () => {
      try {
        const vitals = generateVitalSigns();
        const result = await r.table('metrics').insert({
          timestamp: new Date(),
          metric_name: "Vital Signs",
          vital_signs: vitals,
          heartRate: vitals.heartRate,
          bloodPressure: vitals.bloodPressure,
          temperature: vitals.temperature,
          oxygenLevel: vitals.oxygenLevel,
          respiratoryRate: vitals.respiratoryRate
        }).run(connection);
        console.log('Inserted medical data:', result);
      } catch (err) {
        console.error('Error inserting data:', err);
      }
    }, 1000);

  } catch (err) {
    console.error('Error:', err);
  }
}

insertMedicalData();