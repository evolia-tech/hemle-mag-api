import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateArticlesTable1784580016116 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Création de l'ENUM pour le statut de l'article
    await queryRunner.query(`
      CREATE TYPE "articles_status_enum" AS ENUM (
        'DRAFT',
        'PUBLISHED'
      )
    `);

    // 2. Création de la table articles
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'cover_image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'PUBLISHED'],
            enumName: 'articles_status_enum',
            default: `'DRAFT'`,
          },
          {
            name: 'published_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'author_id',
            type: 'uuid',
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
            name: 'IDX_articles_slug',
            columnNames: ['slug'],
            isUnique: true,
          },
        ],
      }),
      true,
    );

    // 3. Création de la clé étrangère vers la table staffs
    await queryRunner.createForeignKey(
      'articles',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'staffs',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Suppression de la table articles (qui va drop la FK automatiquement)
    await queryRunner.dropTable('articles', true);

    // 2. Suppression de l'ENUM articles_status_enum
    await queryRunner.query(`DROP TYPE IF EXISTS "articles_status_enum"`);
  }
}
