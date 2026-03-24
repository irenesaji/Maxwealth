import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedOnboardingWithBse1731871566698
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user_nominee_details\`
            ADD COLUMN \`pan\` varchar(100) NULL,
            ADD COLUMN \`guardian_dob\` DATE NULL,
            ADD COLUMN \`guardian_pan\` varchar(100)  NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
