import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserEntity1763195662557 implements MigrationInterface {
    name = 'FixUserEntity1763195662557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d0fed6c2fc25ef43c2f29f5b192"`);
        await queryRunner.query(`CREATE TABLE "student_classes" ("userId" uuid NOT NULL, "classId" uuid NOT NULL, CONSTRAINT "PK_ee6fce5037b6ffcdbf8aeab560f" PRIMARY KEY ("userId", "classId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_57793635aa299f1f681677b6ad" ON "student_classes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3f18cbd0ea5362b0c872707073" ON "student_classes" ("classId") `);
        await queryRunner.query(`ALTER TABLE "student_classes" ADD CONSTRAINT "FK_57793635aa299f1f681677b6adf" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "student_classes" ADD CONSTRAINT "FK_3f18cbd0ea5362b0c8727070739" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_classes" DROP CONSTRAINT "FK_3f18cbd0ea5362b0c8727070739"`);
        await queryRunner.query(`ALTER TABLE "student_classes" DROP CONSTRAINT "FK_57793635aa299f1f681677b6adf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3f18cbd0ea5362b0c872707073"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_57793635aa299f1f681677b6ad"`);
        await queryRunner.query(`DROP TABLE "student_classes"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d0fed6c2fc25ef43c2f29f5b192" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
