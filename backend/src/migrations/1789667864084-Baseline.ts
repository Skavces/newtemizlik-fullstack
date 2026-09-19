import { MigrationInterface, QueryRunner } from "typeorm";

export class Baseline1789667864084 implements MigrationInterface {
    name = 'Baseline1789667864084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_config" ("id" integer NOT NULL, "totpSecret" text, "username" text, "passwordHash" text, "tokenVersion" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c486270cca36cc6c0ee6cf65f74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "references" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "logo" character varying, "scale" numeric(3,2) NOT NULL DEFAULT '1', "published" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_795ec632ca1153bf5ec99d656e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_94464539e9e225f13f495eba4a" ON "references" ("published", "sortOrder") `);
        await queryRunner.query(`CREATE TABLE "quote_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "adSoyad" character varying(120), "telefon" character varying(20), "ePosta" character varying(120), "panelAdeti" integer NOT NULL, "sahaMegavati" numeric(8,2) NOT NULL, "suUlasimi" boolean NOT NULL, "kvkkConsent" boolean NOT NULL DEFAULT false, "consentAt" TIMESTAMP NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'new', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c05f72de8be0ec6b0985a851558" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5680379ca9a0fdbcc0381144b9" ON "quote_requests" ("createdAt") `);
        await queryRunner.query(`CREATE TABLE "app_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "level" character varying(10) NOT NULL, "context" character varying(100), "message" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af92fcf6a344e358a54f243797e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8fa77a8631daaa7c36b6f9dd1f" ON "app_logs" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_app_logs_level_createdAt" ON "app_logs" ("level", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "faqs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scope" character varying(30) NOT NULL DEFAULT 'genel', "question" character varying NOT NULL, "answer" text NOT NULL, "published" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56f0788c8583c27f07a5947c6a" ON "faqs" ("published", "scope", "sortOrder") `);
        await queryRunner.query(`CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "excerpt" character varying, "metaDescription" character varying, "content" text NOT NULL DEFAULT '', "coverImage" character varying, "published" boolean NOT NULL DEFAULT false, "publishedAt" TIMESTAMP, "sortOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE ("slug"), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f24a31bd868aa2bbac7102dc1" ON "blog_posts" ("published", "sortOrder") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6f24a31bd868aa2bbac7102dc1"`);
        await queryRunner.query(`DROP TABLE "blog_posts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56f0788c8583c27f07a5947c6a"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_app_logs_level_createdAt"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8fa77a8631daaa7c36b6f9dd1f"`);
        await queryRunner.query(`DROP TABLE "app_logs"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5680379ca9a0fdbcc0381144b9"`);
        await queryRunner.query(`DROP TABLE "quote_requests"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94464539e9e225f13f495eba4a"`);
        await queryRunner.query(`DROP TABLE "references"`);
        await queryRunner.query(`DROP TABLE "admin_config"`);
    }

}
