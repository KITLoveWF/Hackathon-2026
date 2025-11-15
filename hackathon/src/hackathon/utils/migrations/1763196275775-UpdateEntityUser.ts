import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityUser1763196275775 implements MigrationInterface {
    name = 'UpdateEntityUser1763196275775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "classId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "classId" uuid`);
    }

}
