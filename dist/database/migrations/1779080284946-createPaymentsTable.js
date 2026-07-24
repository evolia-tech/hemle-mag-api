"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentsTable1779080284946 = void 0;
const typeorm_1 = require("typeorm");
class CreatePaymentsTable1779080284946 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE payment_status_enum AS ENUM ('SUCCEEDED','FAILED','PENDING')`);
        await queryRunner.createTable(new typeorm_1.Table({
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
                    isUnique: true,
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
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('payments');
        await queryRunner.query(`DROP TYPE payment_status_enum`);
    }
}
exports.CreatePaymentsTable1779080284946 = CreatePaymentsTable1779080284946;
//# sourceMappingURL=1779080284946-createPaymentsTable.js.map