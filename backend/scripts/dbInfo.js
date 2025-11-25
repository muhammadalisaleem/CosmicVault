const { connectPool, closePool } = require('../src/config/database');

async function run() {
  let pool;
  try {
    pool = await connectPool();

    const serverRes = await pool.request().query(`SELECT @@SERVERNAME AS ServerName, SERVERPROPERTY('InstanceName') AS InstanceName, DB_NAME() AS CurrentDatabase`);
    console.log('Server Info:', serverRes.recordset[0]);

    const dbs = await pool.request().query(`SELECT name FROM sys.databases ORDER BY name`);
    console.log('Databases:', dbs.recordset.map(r => r.name).join(', '));

    const consts = await pool.request().query(`SELECT TOP 50 ConstellationID, Name, Abbreviation FROM Constellations ORDER BY ConstellationID`);
    console.log('Sample Constellations (top 50):');
    consts.recordset.forEach(r => console.log(`${r.ConstellationID} | ${r.Name} | ${r.Abbreviation}`));

  } catch (err) {
    console.error('DB info failed:', err.message || err);
  } finally {
    try { await closePool(); } catch (e) {}
    process.exit(0);
  }
}

run();
