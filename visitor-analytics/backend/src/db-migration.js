import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../data/analytics.db');
const db = new Database(dbPath);

console.log('🔄 Running database migration...');

try {
  // Add new columns to visitors table
  const visitorColumns = [
    'ALTER TABLE visitors ADD COLUMN latitude REAL',
    'ALTER TABLE visitors ADD COLUMN longitude REAL',
    'ALTER TABLE visitors ADD COLUMN organization TEXT',
    'ALTER TABLE visitors ADD COLUMN asn TEXT',
    'ALTER TABLE visitors ADD COLUMN asn_name TEXT'
  ];

  // Add new columns to sessions table
  const sessionColumns = [
    'ALTER TABLE sessions ADD COLUMN platform TEXT',
    'ALTER TABLE sessions ADD COLUMN cpu_cores INTEGER',
    'ALTER TABLE sessions ADD COLUMN device_memory REAL',
    'ALTER TABLE sessions ADD COLUMN pixel_ratio REAL',
    'ALTER TABLE sessions ADD COLUMN cookies_enabled BOOLEAN',
    'ALTER TABLE sessions ADD COLUMN online BOOLEAN',
    'ALTER TABLE sessions ADD COLUMN pdf_viewer BOOLEAN',
    'ALTER TABLE sessions ADD COLUMN gpu_renderer TEXT',
    'ALTER TABLE sessions ADD COLUMN gpu_vendor TEXT'
  ];

  let migratedCount = 0;

  // Try to add each column (will fail silently if column already exists)
  [...visitorColumns, ...sessionColumns].forEach(sql => {
    try {
      db.exec(sql);
      migratedCount++;
      console.log(`✅ Executed: ${sql}`);
    } catch (error) {
      // Column already exists, that's fine
      if (error.message.includes('duplicate column name')) {
        console.log(`ℹ️  Column already exists, skipping`);
      } else {
        console.error(`❌ Error: ${error.message}`);
      }
    }
  });

  console.log(`\n✅ Migration complete! Added ${migratedCount} new columns.`);
  console.log('📊 Database is ready with enhanced tracking fields.\n');

} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
