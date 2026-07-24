"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemsTable1779080605976 = void 0;
const typeorm_1 = require("typeorm");
class OrderItemsTable1779080605976 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createForeignKey('order_items', new typeorm_1.TableForeignKey({
            columnNames: ['order_id'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
        }));
        await queryRunner.query(`CREATE INDEX IDX_order_items_product_id ON order_items(product_id)`);
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable('order_items');
        if (table) {
            const fk = table.foreignKeys.find((fk) => fk.columnNames.includes('order_id'));
            if (fk) {
                await queryRunner.dropForeignKey('order_items', fk);
            }
        }
        await queryRunner.dropTable('order_items');
    }
}
exports.OrderItemsTable1779080605976 = OrderItemsTable1779080605976;
//# sourceMappingURL=1779080605976-orderItemsTable.js.map