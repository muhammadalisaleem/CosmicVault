const path = require('path');
const fs = require('fs');
const { connectPool, closePool } = require('../src/config/database');

async function run() {
  const jsonFile = path.resolve(__dirname, '..', '..', 'src', 'data', 'constellations.json');

  if (!fs.existsSync(jsonFile)) {
    console.error('Local constellations JSON not found:', jsonFile);
    process.exit(1);
  }

  const constellations = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

  let pool;
  try {
    pool = await connectPool();
    console.log('Connected to DB — applying destructive refresh for Constellations');

    console.log('Setting CelestialObjects.ConstellationID to NULL to avoid FK conflicts...');
    await pool.request().query('UPDATE CelestialObjects SET ConstellationID = NULL WHERE ConstellationID IS NOT NULL');

    console.log('Deleting existing Constellations...');
    await pool.request().query('DELETE FROM Constellations');

    console.log(`Inserting ${constellations.length} constellations...`);
    for (let i = 0; i < constellations.length; i++) {
      const c = constellations[i];
      try {
        await pool.request()
          .input('Name', c.Name)
          .input('Abbreviation', c.Abbreviation)
          .input('Description', c.Description)
          .query('INSERT INTO Constellations (Name, Abbreviation, Description) VALUES (@Name, @Abbreviation, @Description)');
      } catch (err) {
        console.error(`Failed to insert constellation ${c.Name}:`, err.message || err);
      }
    }

    console.log('Constellations refresh complete.');
  } catch (err) {
    console.error('Error running force seed:', err.message || err);
    process.exit(1);
  } finally {
    try { await closePool(); } catch (e) {}
    process.exit(0);
  }
}

run();
