import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableIndex,
} from 'typeorm';
export class CreateMediaTable1778464551398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'media',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'filename',
                        type: 'varchar',
                    },
                    {
                        name: 'key',
                        type: 'varchar',
                    },
                    {
                        name: 'publicUrl',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'mimeType',
                        type: 'varchar',
                    },
                    {
                        name: 'size',
                        type: 'bigint',
                    },
                    {
                        name: 'entityType',
                        type: 'varchar',
                    },
                    {
                        name: 'entityId',
                        type: 'uuid',
                    },
                    {
                        name: 'isPrimary',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'isPrivate',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'sortOrder',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        /**
         * Index pour accélérer les recherches par entité
         * Très important pour performance.
         */
        await queryRunner.createIndex(
            'media',
            new TableIndex({
                name: 'IDX_MEDIA_ENTITY',
                columnNames: ['entityType', 'entityId'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.dropIndex('media', 'IDX_MEDIA_ENTITY');
        await queryRunner.dropTable('media');
    }
}
