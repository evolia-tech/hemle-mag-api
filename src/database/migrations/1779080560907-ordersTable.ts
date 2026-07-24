import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class OrdersTable1779080560907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE order_status_enum AS ENUM ('PAID','CANCELLED')`,
        );

        await queryRunner.createTable(
            new Table({
                name: 'orders',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'status',
                        type: 'order_status_enum',
                    },
                    {
                        name: 'total_amount',
                        type: 'numeric',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                    },
                    {
                        name: 'payment_id',
                        type: 'uuid',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'orders',
            new TableForeignKey({
                columnNames: ['payment_id'],
                referencedTableName: 'payments',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.query(
            `CREATE INDEX IDX_orders_email ON orders(email)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('orders');

        if (table) {
            const fk = table.foreignKeys.find((fk) =>
                fk.columnNames.includes('payment_id'),
            );

            if (fk) {
                await queryRunner.dropForeignKey('orders', fk);
            }
        }

        await queryRunner.dropTable('orders');
        await queryRunner.query(`DROP TYPE order_status_enum`);
    }
}
