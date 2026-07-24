"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersTable1779080560907 = void 0;
const typeorm_1 = require("typeorm");
class OrdersTable1779080560907 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE order_status_enum AS ENUM ('PAID','CANCELLED')`);
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('orders', new typeorm_1.TableForeignKey({
            columnNames: ['payment_id'],
            referencedTableName: 'payments',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.query(`CREATE INDEX IDX_orders_email ON orders(email)`);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('orders');
        if (table) {
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes('payment_id'));
            if (fk) {
                await queryRunner.dropForeignKey('orders', fk);
            }
        }
        await queryRunner.dropTable('orders');
        await queryRunner.query(`DROP TYPE order_status_enum`);
    }
}
exports.OrdersTable1779080560907 = OrdersTable1779080560907;
//# sourceMappingURL=1779080560907-ordersTable.js.map