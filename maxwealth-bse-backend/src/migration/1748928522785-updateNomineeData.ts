import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNomineeData1748928522785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE user_nominee_details
            ADD COLUMN identity_proof_type VARCHAR(100) NULL,
            ADD COLUMN aadhaar_number VARCHAR(20) NULL,
            ADD COLUMN passport_number VARCHAR(100) NULL,
            ADD COLUMN driving_license_number VARCHAR(100) NULL,
            ADD COLUMN email_address VARCHAR(255) NULL,
            ADD COLUMN isd VARCHAR(10) NULL,
            ADD COLUMN phone_number VARCHAR(15) NULL,
            ADD COLUMN address_city VARCHAR(100) NULL,
            ADD COLUMN address_state VARCHAR(100) NULL,
            ADD COLUMN address_country VARCHAR(100) NULL,
            ADD COLUMN address_postal_code VARCHAR(10) NULL
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
