import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddfcmtokentoUser1714625491365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD COLUMN \`fcmToken\` text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
