"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMediaTable1778464551398 = void 0;
const typeorm_1 = require("typeorm");
class CreateMediaTable1778464551398 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'media',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'filename',
                    type: 'varchar',
                },
                {
                    name: 'key',
                    type: 'varchar',
                },
                {
                    name: 'publicUrl',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'mimeType',
                    type: 'varchar',
                },
                {
                    name: 'size',
                    type: 'bigint',
                },
                {
                    name: 'entityType',
                    type: 'varchar',
                },
                {
                    name: 'entityId',
                    type: 'uuid',
                },
                {
                    name: 'isPrimary',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'isPrivate',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'sortOrder',
                    type: 'int',
                    default: 0,
                },
                {
                    name: 'createdAt',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'deletedAt',
                    type: 'timestamptz',
                    isNullable: true,
                },
            ],
        }), true);
        await queryRunner.createIndex('media', new typeorm_1.TableIndex({
            name: 'IDX_MEDIA_ENTITY',
            columnNames: ['entityType', 'entityId'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropIndex('media', 'IDX_MEDIA_ENTITY');
        await queryRunner.dropTable('media');
    }
}
exports.CreateMediaTable1778464551398 = CreateMediaTable1778464551398;
//# sourceMappingURL=1778464551398-CreateMediaTable.js.map