"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMagazinesTable1778225853015 = void 0;
const typeorm_1 = require("typeorm");
class CreateMagazinesTable1778225853015 {
    name = 'CreateMagazinesTable1778225853015';
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'magazines',
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
                    name: 'slug',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'number',
                    type: 'varchar',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'summary',
                    type: 'text',
                },
                {
                    name: 'price',
                    type: 'numeric',
                    precision: 10,
                    scale: 2,
                },
                {
                    name: 'release_date',
                    type: 'date',
                },
                {
                    name: 'is_published',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'sections',
                    type: 'jsonb',
                    default: "'[]'::jsonb",
                },
            ],
        }), true);
        await queryRunner.createForeignKeys('magazines', [
            new typeorm_1.TableForeignKey({
                columnNames: ['created_by_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
            new typeorm_1.TableForeignKey({
                columnNames: ['updated_by_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        ]);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('magazines');
        if (table) {
            const createdByFk = table.foreignKeys.find((fk) => fk.columnNames.includes('created_by_id'));
            const updatedByFk = table.foreignKeys.find((fk) => fk.columnNames.includes('updated_by_id'));
            if (createdByFk) {
                await queryRunner.dropForeignKey('magazines', createdByFk);
            }
            if (updatedByFk) {
                await queryRunner.dropForeignKey('magazines', updatedByFk);
            }
        }
        await queryRunner.dropTable('magazines');
    }
}
exports.CreateMagazinesTable1778225853015 = CreateMagazinesTable1778225853015;
//# sourceMappingURL=1778225853015-CreateMagazinesTable.js.map