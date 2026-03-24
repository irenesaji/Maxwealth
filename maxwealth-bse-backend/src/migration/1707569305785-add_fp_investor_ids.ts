import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFpInvestorIds1707569305785 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_nominee_details add column fp_id varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE user_address_details add column fp_id varchar(255)`,
    );

    await queryRunner.query(`
        CREATE TABLE email_addresses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fp_id VARCHAR(255) NOT NULL,
            profile VARCHAR(255) NOT NULL,
            email VARCHAR(100) NOT NULL,
            belongs_to VARCHAR(100) NOT NULL,
            created_at datetime,
            user_id int,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );`);

    await queryRunner.query(`
        CREATE TABLE phone_numbers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fp_id VARCHAR(255) NOT NULL,
            profile VARCHAR(255) NOT NULL,
            isd VARCHAR(10) NOT NULL,
            number VARCHAR(100) NOT NULL,
            belongs_to VARCHAR(100) NOT NULL,
            created_at datetime,
            user_id int,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
