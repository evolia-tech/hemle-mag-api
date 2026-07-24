"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const typeorm_1 = require("typeorm");
const role_enum_1 = require("../../modules/staffs/enums/role.enum");
const staff_entity_1 = require("../../modules/staffs/entities/staff.entity");
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [staff_entity_1.Staff]
});
async function seed() {
    await dataSource.initialize();
    console.log('🔌 Connected to database');
    const staffRepo = dataSource.getRepository(staff_entity_1.Staff);
    const SEED_EMAIL = 'superadmin@hemle-mag.test';
    const exists = await staffRepo.findOne({
        where: { email: SEED_EMAIL }
    });
    if (exists) {
        console.log('⚠️  Super admin already exists, skipping.');
        await dataSource.destroy();
        return;
    }
    const superAdmin = staffRepo.create({
        email: SEED_EMAIL,
        password: 'Hemle2025!',
        firstName: 'Super',
        lastName: 'Admin',
        roles: [role_enum_1.Role.SUPER_ADMIN, role_enum_1.Role.ADMIN, role_enum_1.Role.EDITOR],
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
//# sourceMappingURL=seed-admin.js.map