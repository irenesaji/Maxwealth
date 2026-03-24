import { MigrationInterface, QueryRunner } from 'typeorm';

export class Kycstatus1738057276234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS kyc_status (
                id INT PRIMARY KEY,
                status_description VARCHAR(255) NOT NULL
            );
        `);

    // Insert KYC Status values
    await queryRunner.query(`
            INSERT INTO kyc_status (id, status_description) VALUES
            (1, 'UNDER_PROCESS'),
            (2, 'KYC REGISTERED'),
            (3, 'ON HOLD'),
            (4, 'KYC REJECTED'),
            (5, 'NOT AVAILABLE'),
            (6, 'Deactivate'),
            (7, 'KYC Validated'),
            (12, 'KYC REGISTERED - Incomplete KYC (Existing / OLD Record)'),
            (11, 'UNDER_PROCESS - Incomplete KYC (Existing / OLD Record)'),
            (13, 'ON HOLD - Incomplete KYC (Existing / OLD Record)'),
            (22, 'CVL MF KYC'),
            (99, 'If specific KRA web service is not reachable')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
