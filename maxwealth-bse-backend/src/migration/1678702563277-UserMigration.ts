import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1678702563277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`full_name\` varchar(150) NOT NULL,  \`email\` varchar(100) NOT NULL, \`mobile\` varchar(15) NOT NULL, \`country_code\` varchar(5) NOT NULL DEFAULT '+91', \`otp\` int null, \`mobile_verified\` tinyint NOT NULL DEFAULT 0, \`mpin\` int NULL,  \`is_active\` tinyint NOT NULL DEFAULT 1,\`is_blocked\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`),CONSTRAINT UC_User_Email UNIQUE (email),CONSTRAINT UC_User_Mobile UNIQUE (mobile)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
