import { MigrationInterface, QueryRunner } from 'typeorm';

export class createBankDetails1680140576295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user_bank_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`account_holder_name\` varchar(200) NOT NULL,  \`account_number\` varchar(255) NOT NULL, \`ifsc_code\` varchar(255) NOT NULL,
         \`proof\` varchar(255)  NULL,  \`bank_name\` varchar(255)  NULL,  \`is_penny_drop_success\` tinyint  NOT NULL default false,  \`is_penny_drop_attempted\` tinyint  NOT NULL default false, \`is_primary\` tinyint  NOT NULL default false,  \`penny_drop_request_id\` varchar(255)  NULL,
         user_id int not null,PRIMARY KEY (\`id\`),   FOREIGN KEY (\`user_id\`) REFERENCES users(id),  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_bank_details\``);
  }
}
