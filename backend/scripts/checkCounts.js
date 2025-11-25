const { connectPool, closePool } = require('../src/config/database');

async function run() {
  let pool;
  try {
    pool = await connectPool();
    const queries = [
      { name: 'Constellations', sql: 'SELECT COUNT(*) AS Count FROM Constellations' },
      { name: 'CelestialObjects', sql: 'SELECT COUNT(*) AS Count FROM CelestialObjects' },
      { name: 'ObjectTypes', sql: 'SELECT COUNT(*) AS Count FROM ObjectTypes' },
      { name: 'Users', sql: 'SELECT COUNT(*) AS Count FROM Users' },
      { name: 'ObservationLogs', sql: 'SELECT COUNT(*) AS Count FROM ObservationLogs' }
    ];

    for (const q of queries) {
      try {
        const result = await pool.request().query(q.sql);
        const count = (result.recordset[0] && result.recordset[0].Count) || 0;
        console.log(`${q.name}: ${count}`);
      } catch (err) {
        console.log(`${q.name}: ERROR - ${err.message}`);
      }
    }

  } catch (err) {
    console.error('DB check failed:', err.message || err);
  } finally {
    try { await closePool(); } catch (e) {}
    process.exit(0);
  }
}

run();
