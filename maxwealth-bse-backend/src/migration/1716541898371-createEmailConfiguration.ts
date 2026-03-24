import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailConfiguration1716541898371
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`email_configuration\`(
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`key_json\` json ,
            \`provider\` varchar(300) NOT NULL,
            PRIMARY KEY (\`id\`))
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
