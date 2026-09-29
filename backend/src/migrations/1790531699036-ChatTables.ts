import { MigrationInterface, QueryRunner } from "typeorm";

export class ChatTables1790531699036 implements MigrationInterface {
    name = 'ChatTables1790531699036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" smallint NOT NULL, "sessionId" uuid, "messageCount" integer NOT NULL DEFAULT '0', "conversation" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf1d15a21625a97cf2c2218108b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_chat_ratings_sessionId" ON "chat_ratings" ("sessionId") `);
        await queryRunner.query(`CREATE TABLE "chat_leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sessionId" uuid NOT NULL, "conversation" jsonb, "messageCount" integer NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'active', "rating" smallint, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c58193c7c41658bfef13fdc675" UNIQUE ("sessionId"), CONSTRAINT "PK_d938803b4ca1d7916f1ff9a0f94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bab525ebda0b40934da04bb982" ON "chat_leads" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "chat_daily_stats" ("date" date NOT NULL, "opened" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_b3bc5ac83d92ea0d36dc9593b65" PRIMARY KEY ("date"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chat_daily_stats"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bab525ebda0b40934da04bb982"`);
        await queryRunner.query(`DROP TABLE "chat_leads"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_chat_ratings_sessionId"`);
        await queryRunner.query(`DROP TABLE "chat_ratings"`);
    }

}
