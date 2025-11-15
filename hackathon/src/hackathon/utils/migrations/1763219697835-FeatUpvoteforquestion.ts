import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatUpvoteforquestion1763219697835 implements MigrationInterface {
    name = 'FeatUpvoteforquestion1763219697835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "upvotes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0f44aa26d0952948ef31dc1a777" UNIQUE ("questionId", "userId"), CONSTRAINT "PK_1c153b493d535b066882358eeae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "upvotes" ADD CONSTRAINT "FK_3f7fdc826ef07656106e9311559" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upvotes" DROP CONSTRAINT "FK_3f7fdc826ef07656106e9311559"`);
        await queryRunner.query(`DROP TABLE "upvotes"`);
    }

}
