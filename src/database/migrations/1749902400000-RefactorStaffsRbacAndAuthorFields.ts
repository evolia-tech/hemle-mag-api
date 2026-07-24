import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Migration : Refactorisation du module Auth pour RBAC multi-rôles
 *
 * Changements :
 * 1. Colonne `role` (enum PostgreSQL) → `roles` (text/simple-array) pour supporter plusieurs rôles
 * 2. Ajout de la colonne `slug` (varchar unique nullable) pour l'URL de la page auteur
 * 3. Ajout de la colonne `bio` (text nullable) pour la biographie de l'auteur
 * 4. Ajout de la colonne `avatar_url` (varchar nullable) pour la photo de profil
 * 5. Ajout de la colonne `job_title` (varchar nullable) pour le titre du poste
 */
export class RefactorStaffsRbacAndAuthorFields1749902400000 implements MigrationInterface {
  name = 'RefactorStaffsRbacAndAuthorFields1749902400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── 1. Suppression de l'ancienne colonne enum `role` ───────────────────
    await queryRunner.dropColumn('staffs', 'role');
    await queryRunner.query(`DROP TYPE IF EXISTS "staffs_role_enum"`);

    // ─── 2. Ajout de la colonne `roles` (simple-array = varchar CSV) ─────────
    // TypeORM simple-array stocke les valeurs sous forme de chaîne CSV
    // Ex: 'ADMIN,EDITOR' ou 'SUPER_ADMIN,ADMIN,EDITOR'
    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'roles',
        type: 'varchar',
        default: `'EDITOR'`,
        isNullable: false,
        comment: 'Rôles RBAC du membre staff (CSV: SUPER_ADMIN, ADMIN, EDITOR)',
      }),
    );

    // ─── 3. Champs auteur ─────────────────────────────────────────────────────

    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        isUnique: true,
        isNullable: true,
        comment: 'Slug URL-friendly pour la page auteur publique',
      }),
    );

    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'bio',
        type: 'text',
        isNullable: true,
        comment: 'Biographie courte affichée sous les articles',
      }),
    );

    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'avatar_url',
        type: 'varchar',
        isNullable: true,
        comment: 'URL de la photo de profil de l\'auteur',
      }),
    );

    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'job_title',
        type: 'varchar',
        isNullable: true,
        comment: 'Titre du poste (ex: Rédacteur en chef)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ─── Suppression des champs auteur ────────────────────────────────────────
    await queryRunner.dropColumn('staffs', 'job_title');
    await queryRunner.dropColumn('staffs', 'avatar_url');
    await queryRunner.dropColumn('staffs', 'bio');
    await queryRunner.dropColumn('staffs', 'slug');

    // ─── Suppression de la colonne roles ──────────────────────────────────────
    await queryRunner.dropColumn('staffs', 'roles');

    // ─── Restauration de l'ancienne colonne role (enum) ───────────────────────
    await queryRunner.query(
      `CREATE TYPE "staffs_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'EDITOR')`,
    );
    await queryRunner.addColumn(
      'staffs',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enum: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
        enumName: 'staffs_role_enum',
        default: `'EDITOR'`,
        isNullable: false,
      }),
    );
  }
}
