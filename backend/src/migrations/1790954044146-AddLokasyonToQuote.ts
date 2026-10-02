import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLokasyonToQuote1790954044146 implements MigrationInterface {
    name = 'AddLokasyonToQuote1790954044146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_requests" ADD "lokasyon" character varying(160)`);
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "sahaMegavati" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "sahaMegavati" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote_requests" DROP COLUMN "lokasyon"`);
    }

}
