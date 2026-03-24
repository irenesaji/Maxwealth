import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmsConfiguration1704458577696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`sms_configuration\`(
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`keys_json\` JSON,
            \`provider\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`sms_configuration\``);
  }
}
