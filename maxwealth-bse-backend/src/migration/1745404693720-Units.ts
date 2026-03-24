import { MigrationInterface, QueryRunner } from 'typeorm';

export class Units1745404693720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`redemptions\`
            MODIFY COLUMN \`units\` DECIMAL(10, 3)
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
