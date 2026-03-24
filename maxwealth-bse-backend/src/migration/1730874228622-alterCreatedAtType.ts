import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCreatedAtType1730874228622 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE switch_funds 
            MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ;`);

    await queryRunner.query(`ALTER TABLE redemptions 
            MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);

    await queryRunner.query(`ALTER TABLE purchases 
            MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
