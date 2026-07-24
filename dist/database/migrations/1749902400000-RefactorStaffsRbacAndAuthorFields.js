"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactorStaffsRbacAndAuthorFields1749902400000 = void 0;
const typeorm_1 = require("typeorm");
class RefactorStaffsRbacAndAuthorFields1749902400000 {
    name = 'RefactorStaffsRbacAndAuthorFields1749902400000';
    async up(queryRunner) {
        await queryRunner.dropColumn('staffs', 'role');
        await queryRunner.query(`DROP TYPE IF EXISTS "staffs_role_enum"`);
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'roles',
            type: 'varchar',
            default: `'EDITOR'`,
            isNullable: false,
            comment: 'Rôles RBAC du membre staff (CSV: SUPER_ADMIN, ADMIN, EDITOR)',
        }));
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
            comment: 'Slug URL-friendly pour la page auteur publique',
        }));
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'bio',
            type: 'text',
            isNullable: true,
            comment: 'Biographie courte affichée sous les articles',
        }));
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'avatar_url',
            type: 'varchar',
            isNullable: true,
            comment: 'URL de la photo de profil de l\'auteur',
        }));
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'job_title',
            type: 'varchar',
            isNullable: true,
            comment: 'Titre du poste (ex: Rédacteur en chef)',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('staffs', 'job_title');
        await queryRunner.dropColumn('staffs', 'avatar_url');
        await queryRunner.dropColumn('staffs', 'bio');
        await queryRunner.dropColumn('staffs', 'slug');
        await queryRunner.dropColumn('staffs', 'roles');
        await queryRunner.query(`CREATE TYPE "staffs_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR')`);
        await queryRunner.addColumn('staffs', new typeorm_1.TableColumn({
            name: 'role',
            type: 'enum',
            enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
            enumName: 'staffs_role_enum',
            default: `'EDITOR'`,
            isNullable: false,
        }));
    }
}
exports.RefactorStaffsRbacAndAuthorFields1749902400000 = RefactorStaffsRbacAndAuthorFields1749902400000;
//# sourceMappingURL=1749902400000-RefactorStaffsRbacAndAuthorFields.js.map