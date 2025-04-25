import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingRecordsTable1745234540766
  implements MigrationInterface
{
  name = 'CreateBillingRecordsTable1745234540766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "billing_records" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "photo_url" character varying(255), "product_code" character varying(50) NOT NULL, "location" character varying(100) NOT NULL, "premium_paid" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_11e0a792cf3ae4ebcc71f7fa0ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_location" ON "billing_records" ("location") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_code" ON "billing_records" ("product_code") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_location" ON "billing_records" ("product_code", "location") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_product_location"`);
    await queryRunner.query(`DROP INDEX "public"."idx_product_code"`);
    await queryRunner.query(`DROP INDEX "public"."idx_location"`);
    await queryRunner.query(`DROP TABLE "billing_records"`);
  }
}
