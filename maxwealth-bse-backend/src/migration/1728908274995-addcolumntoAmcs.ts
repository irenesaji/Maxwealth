import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddcolumntoAmcs1728908274995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE amcs 
            ADD COLUMN rta varchar(300),
            ADD COLUMN rta_amc_code varchar(200)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
