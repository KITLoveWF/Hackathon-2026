import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchemaUser1763179670442 implements MigrationInterface {
    name = 'UpdateSchemaUser1763179670442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d0fed6c2fc25ef43c2f29f5b192" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d0fed6c2fc25ef43c2f29f5b192"`);
    }

}
