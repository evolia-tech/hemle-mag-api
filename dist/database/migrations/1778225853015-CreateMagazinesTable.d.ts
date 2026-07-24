import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateMagazinesTable1778225853015 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
