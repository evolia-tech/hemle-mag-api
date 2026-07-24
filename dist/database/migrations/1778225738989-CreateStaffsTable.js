"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStaffsTable1778225738989 = void 0;
const typeorm_1 = require("typeorm");
class CreateStaffsTable1778225738989 {
    name = 'CreateStaffsTable1778225738989';
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'staffs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'created_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_by_id',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                },
                {
                    name: 'role',
                    type: 'enum',
                    enumName: 'staffs_role_enum',
                    enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
                    default: `'EDITOR'`,
                },
                {
                    name: 'is_active',
                    type: 'boolean',
                    default: true,
                },
            ],
        }), true);
        await queryRunner.createForeignKeys('staffs', [
            new typeorm_1.TableForeignKey({
                columnNames: ['created_by_id'],
                referencedTableName: 'staffs',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['updated_by_id'],
                referencedTableName: 'staffs',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        ]);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('staffs');
        if (table) {
            const createdByFk = table.foreignKeys.find((fk) => fk.columnNames.includes('created_by_id'));
            const updatedByFk = table.foreignKeys.find((fk) => fk.columnNames.includes('updated_by_id'));
            if (createdByFk) {
                await queryRunner.dropForeignKey('staffs', createdByFk);
            }
            if (updatedByFk) {
                await queryRunner.dropForeignKey('staffs', updatedByFk);
            }
        }
        await queryRunner.dropTable('staffs');
        await queryRunner.query(`DROP TYPE IF EXISTS "staffs_role_enum"`);
    }
}
exports.CreateStaffsTable1778225738989 = CreateStaffsTable1778225738989;
//# sourceMappingURL=1778225738989-CreateStaffsTable.js.map