import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertToKycStatus1749634437552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO kyc_status (id, status_description) VALUES
            (88, 'Data Not Available')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
