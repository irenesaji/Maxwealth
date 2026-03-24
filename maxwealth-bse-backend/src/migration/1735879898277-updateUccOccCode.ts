import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUccOccCode1735879898277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bse_occ_type\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bse_occ_code\` ADD COLUMN \`type\` varchar(300)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_code\` SET \`type\`="Business" WHERE id IN (1,12)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_code\` SET \`type\`="Service" WHERE id IN (2,3,4,9,10,11,13)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_code\` SET \`type\`="Others" WHERE id IN (5,6,7,8,14)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
