import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMissingFieldsOfOnboarding1718478806082
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`type\` varchar(256) default 'individual'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`tax_status\` varchar(256) default 'individual'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`guardian_name\` varchar(256)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`guardian_date_of_birth\` date`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`guardian_pan\` varchar(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`country_of_birth\` varchar(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`place_of_birth\` varchar(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`source_of_wealth\` varchar(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`pep_details\` varchar(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD COLUMN \`ip_address\` varchar(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details MODIFY is_kyc_compliant tinyint(1)`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`tax_residencies\` (\`id\` int NOT NULL AUTO_INCREMENT, 
        \`investor_tax_residency_sequence\` int NOT NULL, 
         \`country\` varchar(100) NOT NULL, 
         \`taxid_type\` varchar(100) NOT NULL, 
         \`taxid_number\` varchar(100) NOT NULL, 
         PRIMARY KEY (\`id\`),
         user_id int,
         FOREIGN KEY (user_id) REFERENCES users(id),
         \`user_onboarding_detail_id\` int,
         FOREIGN KEY (user_onboarding_detail_id) REFERENCES user_onboarding_details(id),
         \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`demat_accounts\` (\`id\` int NOT NULL AUTO_INCREMENT,  
         \`dp_id\` varchar(256) NOT NULL, 
         \`client_id\` varchar(256) NOT NULL, 
         PRIMARY KEY (\`id\`),
         user_id int,
         FOREIGN KEY (user_id) REFERENCES users(id),
         \`user_onboarding_detail_id\` int,
         FOREIGN KEY (user_onboarding_detail_id) REFERENCES user_onboarding_details(id),
         \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
