import { connectionSource } from './../../config/typeorm';
import { run as runBillingSeed } from './billing.seed';

async function seed() {
  try {
    await connectionSource.initialize();
    console.log('✅ DB connection initialized');

    await runBillingSeed(connectionSource);
    console.log('✅ Billing data seeded');

    await connectionSource.destroy();
    console.log('✅ DB connection closed');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed().catch((err) => {
  console.error('Failed to seed:', err);
});
