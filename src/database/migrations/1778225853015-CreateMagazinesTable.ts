import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMagazinesTable1778225853015
  implements MigrationInterface
{
  name = 'CreateMagazinesTable1778225853015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
            name: 'subtitle',
            type: 'varchar',
            isNullable: true,
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
      }),
      true,
    );

    await queryRunner.createForeignKeys('magazines', [
      new TableForeignKey({
        columnNames: ['created_by_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        columnNames: ['updated_by_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('magazines');

    if (table) {
      const createdByFk = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('created_by_id'),
      );

      const updatedByFk = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('updated_by_id'),
      );

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