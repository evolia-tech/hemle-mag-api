import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePaymentsTable1779080284946 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE payment_status_enum AS ENUM ('SUCCEEDED','FAILED','PENDING')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'provider',
            type: 'varchar',
          },
          {
            name: 'external_payment_id',
            type: 'varchar',
            isUnique: true, // ✅ Idempotence
          },
          {
            name: 'amount',
            type: 'numeric',
            precision: 10,
            scale: 2,
          },
          {
            name: 'currency',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'payment_status_enum',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'raw',
            type: 'jsonb',
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payments');
    await queryRunner.query(`DROP TYPE payment_status_enum`);
  }
}
