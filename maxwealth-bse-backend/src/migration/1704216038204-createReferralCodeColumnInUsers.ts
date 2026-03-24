import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReferralCodeColumnInUsers1704216038204
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users add column referral_code varchar(255) null;`,
    );
    await queryRunner.query(
      `ALTER TABLE users add column user_code varchar(255);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
