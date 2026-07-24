"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateArticlesTable1784580016116 = void 0;
const typeorm_1 = require("typeorm");
class CreateArticlesTable1784580016116 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "articles_status_enum" AS ENUM (
        'DRAFT',
        'PUBLISHED'
      )
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'articles',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'slug',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'summary',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'cover_image_url',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['DRAFT', 'PUBLISHED'],
                    enumName: 'articles_status_enum',
                    default: `'DRAFT'`,
                },
                {
                    name: 'published_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'author_id',
                    type: 'uuid',
                    isNullable: true,
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
            ],
            indices: [
                {
                    name: 'IDX_articles_slug',
                    columnNames: ['slug'],
                    isUnique: true,
                },
            ],
        }), true);
        await queryRunner.createForeignKey('articles', new typeorm_1.TableForeignKey({
            columnNames: ['author_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'staffs',
            onDelete: 'SET NULL',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('articles', true);
        await queryRunner.query(`DROP TYPE IF EXISTS "articles_status_enum"`);
    }
}
exports.CreateArticlesTable1784580016116 = CreateArticlesTable1784580016116;
//# sourceMappingURL=1784580016116-CreateArticlesTable.js.map