import { MigrationInterface, QueryRunner } from 'typeorm';

export class PocIdToAddressMigrations1708446567022
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_address_details add column fp_id_doc_id varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE user_address_details add column fp_kyc_id varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
