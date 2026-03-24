import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRazorPayTables1724763734783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE rzp_orders (
            id VARCHAR(255) PRIMARY KEY,
            entity VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            amount_paid DECIMAL(10, 2) NOT NULL,
            amount_due DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(10) NOT NULL,
            receipt VARCHAR(255),
            offer_id VARCHAR(255),
            status VARCHAR(50) NOT NULL,
            attempts INT NOT NULL,
            created_at BIGINT NOT NULL
        );`);

    await queryRunner.query(`CREATE TABLE rzp_transfers (
            id VARCHAR(255) PRIMARY KEY,
            entity VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            source VARCHAR(255) NOT NULL,
            recipient VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            currency VARCHAR(10) NOT NULL,
            amount_reversed DECIMAL(10, 2) NOT NULL,
            notes JSON,
            linked_account_notes JSON,
            on_hold BOOLEAN NOT NULL,
            on_hold_until BIGINT,
            recipient_settlement_id VARCHAR(255),
            created_at BIGINT NOT NULL,
            processed_at BIGINT,
            error JSON
         
        );
        `);

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` add column is_onboarding_complete tinyint(1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
