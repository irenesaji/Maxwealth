import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePurchases1736340541681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           
            ALTER TABLE purchases
            MODIFY COLUMN  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
