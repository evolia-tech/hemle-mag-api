"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomersTable1782845996180 = void 0;
const typeorm_1 = require("typeorm");
class CreateCustomersTable1782845996180 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'customers',
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
                    isUnique: true,
                },
                {
                    name: 'first_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'last_name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'phone',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'country',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('customers');
    }
}
exports.CreateCustomersTable1782845996180 = CreateCustomersTable1782845996180;
//# sourceMappingURL=1782845996180-CreateCustomersTable.js.map