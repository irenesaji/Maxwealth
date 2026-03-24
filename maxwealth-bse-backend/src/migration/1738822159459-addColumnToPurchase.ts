import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToPurchase1738822159459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`purchases\`
            ADD COLUMN \`order_number\` bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
