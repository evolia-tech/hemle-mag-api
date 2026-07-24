"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewsletterSubscribersTable1781467212209 = void 0;
const typeorm_1 = require("typeorm");
class CreateNewsletterSubscribersTable1781467212209 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TYPE "newsletter_subscriber_status_enum" AS ENUM (
        'PENDING',
        'SUBSCRIBED',
        'UNSUBSCRIBED'
      )
    `);
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'newsletter_subscribers',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: ['PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED'],
                    enumName: 'newsletter_subscriber_status_enum',
                    default: `'SUBSCRIBED'`,
                },
                {
                    name: 'unsubscribe_token',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'subscribed_at',
                    type: 'timestamptz',
                    isNullable: true,
                },
                {
                    name: 'unsubscribed_at',
                    type: 'timestamptz',
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
                    name: 'IDX_newsletter_subscribers_email',
                    columnNames: ['email'],
                    isUnique: true,
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('newsletter_subscribers', true);
        await queryRunner.query(`DROP TYPE IF EXISTS "newsletter_subscriber_status_enum"`);
    }
}
exports.CreateNewsletterSubscribersTable1781467212209 = CreateNewsletterSubscribersTable1781467212209;
//# sourceMappingURL=1781467212209-CreateNewsletterSubscribersTable.js.map