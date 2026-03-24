import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKey1747130157454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE transaction_reports 
            ADD COLUMN file_processed_id BIGINT UNSIGNED
        `);

    await queryRunner.query(`
            ALTER TABLE transaction_reports 
            ADD CONSTRAINT fk_file_process
            FOREIGN KEY (file_processed_id) REFERENCES file_processed(id)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
