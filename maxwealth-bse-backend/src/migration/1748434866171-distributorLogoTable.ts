import { MigrationInterface, QueryRunner } from 'typeorm';

export class DistributorLogoTable1748434866171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE distributor_logo (
              id INT PRIMARY KEY AUTO_INCREMENT,
              tenant_id varchar(255) NOT NULL,
              logo varchar(255),
              \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
              \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
