import { MigrationInterface, QueryRunner } from "typeorm";

// Teklif formu iki hatlı hale geliyor (GES + genel temizlik):
// - hizmet: seçilen hizmetin slug'ı (bkz. src/common/service-catalog.ts). Eski
//   kayıtlarda NULL kalır = hizmet sorulmadan önceki GES formu.
// - metrekare: temizlik taleplerinde opsiyonel yaklaşık alan.
// - panelAdeti / suUlasimi: yalnızca GES taleplerinde anlamlı → nullable.
// Veri silinmez; eski kayıtlar olduğu gibi kalır.
export class AddServiceToQuote1794089264793 implements MigrationInterface {
    name = 'AddServiceToQuote1794089264793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_requests" ADD "hizmet" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "quote_requests" ADD "metrekare" integer`);
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "panelAdeti" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "suUlasimi" DROP NOT NULL`);
    }

    // Uyarı: up'tan sonra temizlik talebi kaydedildiyse panelAdeti/suUlasimi NULL
    // satırlar vardır ve SET NOT NULL başarısız olur. Geri almadan önce o satırlar
    // ya silinmeli ya da elle doldurulmalı — veri kaybını sessizce yapmamak için
    // burada otomatik doldurma yapılmıyor.
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "suUlasimi" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote_requests" ALTER COLUMN "panelAdeti" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quote_requests" DROP COLUMN "metrekare"`);
        await queryRunner.query(`ALTER TABLE "quote_requests" DROP COLUMN "hizmet"`);
    }

}
