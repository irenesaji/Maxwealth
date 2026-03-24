import { MigrationInterface, QueryRunner } from 'typeorm';

export class MandateMigration1687009321418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_bank_details\` ADD column fp_bank_id int`,
    );

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`mandates\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`mandate_type\` varchar(100) NOT NULL, 
            \`fp_bank_id\` int NOT  NULL,  
            \`bank_id\` int NOT  NULL,  
            \`mandate_limit\` int not  NULL,
            \`provider_name\` varchar(100) NULL,
            \`valid_from\` varchar(100) NULL,

            \`mandate_id\` int NULL,
            \`token_url\` varchar(255)  NULL,
            
            \`paymentId\` varchar(255)  NULL,

            \`status\` varchar(255)  NULL,

            \`failureReason\` varchar(255)  NULL,

            \`user_id\` int not null,
             FOREIGN KEY (\`user_id\`) REFERENCES users(id), 
             FOREIGN KEY (\`bank_id\`) REFERENCES user_bank_details(id), 
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (\`id\`))
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
