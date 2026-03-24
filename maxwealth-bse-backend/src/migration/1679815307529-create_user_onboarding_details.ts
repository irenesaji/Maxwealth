import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserOnboardingDetails1679815307529
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user_onboarding_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_kyc_compliant\` tinyint NOT NULL,  \`pan\` varchar(100) NOT NULL, \`full_name\` varchar(40)  NULL, \`date_of_birth\` date  NULL, \`father_name\` varchar(40) null, \`mother_name\` varchar(40) null, \`marital_status\` varchar(40) null, \`gender\` varchar(40) null,  \`occupation\` varchar(40) null, \`annual_income\`  varchar(40) null,\`nationality\`  varchar(40) null,\`signature_url\`  varchar(255) null,\`photo_url\`  varchar(255) null,\`video_url\`  varchar(255) null,\`esign_status\`  varchar(40) null,
        \`esign_id\`  varchar(150) null, \`kyc_id\`  varchar(150) null,\`status\`  varchar(40) null,user_id int not null,PRIMARY KEY (\`id\`),   FOREIGN KEY (\`user_id\`) REFERENCES users(id),  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_onboarding_details\``);
  }
}
