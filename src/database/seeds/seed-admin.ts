// src/database/seeds/seed-admin.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Role } from '../../modules/staffs/enums/role.enum';
import { Staff } from 'src/modules/staffs/entities/staff.entity';

const dataSource = new DataSource(
  {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Staff]
  }
);

async function seed() {
  await dataSource.initialize();
  console.log('🔌 Connected to database');

  const staffRepo = dataSource.getRepository(Staff);

  const SEED_EMAIL = 'superadmin@hemle-mag.test';

  const exists = await staffRepo.findOne({
    where: { email: SEED_EMAIL }
  });

  if (exists) {
    console.log('⚠️  Super admin already exists, skipping.');
    await dataSource.destroy();
    return;
  }

  /**
   * Premier utilisateur créé par le seeder.
   * Possède tous les rôles (SUPER_ADMIN, ADMIN, EDITOR) pour avoir accès total.
   * Mot de passe : Hemle2025! (à changer en production)
   */
  const superAdmin = staffRepo.create({
    email: SEED_EMAIL,
    password: 'Hemle2025!',             // Hashé automatiquement par @BeforeInsert
    firstName: 'Super',
    lastName: 'Admin',
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR], // Tous les rôles
    isActive: true,
    slug: 'super-admin',
    jobTitle: 'Super Administrateur',
    bio: 'Compte administrateur principal du projet Hemle Mag.',
  });

  await staffRepo.save(superAdmin);

  console.log('✅ Super admin créé avec succès');
  console.log('   Email   :', SEED_EMAIL);
  console.log('   Password: Hemle2025!');
  console.log('   Roles   : SUPER_ADMIN, ADMIN, EDITOR');
  console.log('');
  console.log('⚠️  IMPORTANT : Changez ce mot de passe après la première connexion !');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});