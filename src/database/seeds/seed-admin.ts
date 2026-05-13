// src/database/seeds/create-admin.seed.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/users/enums/role.enum';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User],
});

async function seed() {
  await dataSource.initialize();
  console.log('🔌 Connected to database');

  const userRepo = dataSource.getRepository(User);

  const exists = await userRepo.findOne({
    where: { email: 'admin@hemle.com' },
  });

  if (exists) {
    console.log('⚠️  Admin already exists, skipping.');
    await dataSource.destroy();
    return;
  }

  const admin = userRepo.create({
    email: 'admin@hemle.com',
    password: 'Admin123!',          // Sera hashé automatiquement par @BeforeInsert
    firstName: 'Admin',
    lastName: 'Hemle',
    role: Role.SUPER_ADMIN,
    isActive: true,
  });

  await userRepo.save(admin);
  console.log('✅ Admin créé avec succès');
  console.log('   Email: admin@hemle.com');
  console.log('   Password: Admin123!');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});