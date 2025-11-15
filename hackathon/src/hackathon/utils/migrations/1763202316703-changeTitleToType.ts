import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTitleToType1763202316703 implements MigrationInterface {
    name = 'ChangeTitleToType1763202316703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatboxes" RENAME COLUMN "title" TO "type"`);
        await queryRunner.query(`ALTER TABLE "chatboxes" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."chatboxes_type_enum" AS ENUM('in_class', 'off_topic')`);
        await queryRunner.query(`ALTER TABLE "chatboxes" ADD "type" "public"."chatboxes_type_enum" NOT NULL DEFAULT 'in_class'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chatboxes" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."chatboxes_type_enum"`);
        await queryRunner.query(`ALTER TABLE "chatboxes" ADD "type" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "chatboxes" RENAME COLUMN "type" TO "title"`);
    }

}
