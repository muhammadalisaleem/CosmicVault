const fs = require('fs');
const path = require('path');
const { connectPool, closePool } = require('../src/config/database');

async function run() {
  const sqlFile = path.resolve(__dirname, '..', '..', 'sampleDataInsert.sql');

  if (!fs.existsSync(sqlFile)) {
    console.error('SQL seed file not found:', sqlFile);
    process.exit(1);
  }

  const content = fs.readFileSync(sqlFile, 'utf8');
  // Normalize line endings and split on lines containing only GO (case-insensitive)
  const normalized = content.replace(/\r\n/g, '\n');
  const batches = normalized.split(/\nGO\n/i).map(s => s.trim()).filter(Boolean);

  let pool;
  try {
    pool = await connectPool();
    console.log(`Executing ${batches.length} SQL batch(es) from ${sqlFile}`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      try {
        console.log(`Running batch ${i + 1}/${batches.length}...`);
        // Use request().batch if available; .query works for most cases
        await pool.request().query(batch);
        console.log(`Batch ${i + 1} completed.`);
      } catch (err) {
        console.error(`Error executing batch ${i + 1}:`, err.message || err);
        // Continue with next batch
      }
    }

    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    process.exit(1);
  } finally {
    try { await closePool(); } catch (e) {}
    process.exit(0);
  }
}

run();
