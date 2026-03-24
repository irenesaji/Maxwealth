import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedatatypeSources1737623377635 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE sources
            MODIFY COLUMN gain DECIMAL(15,4),
            MODIFY COLUMN units DECIMAL(15,4),
            MODIFY COLUMN days_held DECIMAL(15,4),
            MODIFY COLUMN purchased_at DECIMAL(15,4);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
