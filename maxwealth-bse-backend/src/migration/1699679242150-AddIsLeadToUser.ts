import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsLeadToUser1699679242150 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE users add column is_lead tinyint(1) default false not null;`,
    );

    await queryRunner.query(`ALTER TABLE users
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
