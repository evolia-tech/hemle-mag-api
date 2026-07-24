import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class OrderItemsTable1779080605976 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'product_type',
            type: 'varchar',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'unit_price',
            type: 'numeric',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `CREATE INDEX IDX_order_items_product_id ON order_items(product_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_items');

    if (table) {
      const fk = table.foreignKeys.find((fk) =>
        fk.columnNames.includes('order_id'),
      );

      if (fk) {
        await queryRunner.dropForeignKey('order_items', fk);
      }
    }

    await queryRunner.dropTable('order_items');
  }
}
