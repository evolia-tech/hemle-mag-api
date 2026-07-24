import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddPhoneNumberToStaffs1781450710003 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
