import { db } from './index';
import { users, globalMetrics, templates } from './schema';

export async function seedDatabase() {
  if (!db) {
    console.log('No DATABASE_URL set. Skipping database seed.');
    return;
  }

  console.log('Seeding database with initial data...');

  // 1. Initial operator
  const [operator] = await db
    .insert(users)
    .values({
      discordId: '123456789012345678',
      username: 'DemoOperator',
      discriminator: '0001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      hasAccessRole: true,
    })
    .onConflictDoNothing()
    .returning();

  // 2. Global platform metrics
  await db
    .insert(globalMetrics)
    .values({
      totalSent: 12840,
      totalFailed: 412,
      totalCampaigns: 48,
      totalBots: 14,
    })
    .onConflictDoNothing();

  if (operator) {
    // 3. Reusable template
    await db
      .insert(templates)
      .values({
        userId: operator.id,
        name: 'إعلان مسابقة أسبوعية',
        content: '🎉 مرحباً بكم جميعاً! تم إطلاق المسابقة الأسبوعية الكبرى في سيرفرنا.',
        embedData: {
          title: '🏆 مسابقة أفضل منشئ محتوى',
          description: 'جوائز كبرى تنتظركم! انضم الآن إلى قناة الفعاليات وشارك بصوتك.',
          color: '#7c3aed',
        },
      })
      .onConflictDoNothing();
  }

  console.log('Database seeded successfully.');
}

if (require.main === module) {
  seedDatabase().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
