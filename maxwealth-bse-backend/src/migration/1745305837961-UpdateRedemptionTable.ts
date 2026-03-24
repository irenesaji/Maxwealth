import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRedemptionTable1745305837961 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`redemptions\`
            MODIFY COLUMN \`redeemed_units\` DECIMAL(10, 3)
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
