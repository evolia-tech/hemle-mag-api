import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateNewsletterSubscribersTable1781467212209
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ENUM type for status
    await queryRunner.query(`
      CREATE TYPE "newsletter_subscriber_status_enum" AS ENUM (
        'PENDING',
        'SUBSCRIBED',
        'UNSUBSCRIBED'
      )
    `);

    await queryRunner.createTable(
      new Table({
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
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('newsletter_subscribers', true);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "newsletter_subscriber_status_enum"`,
    );
  }
}
