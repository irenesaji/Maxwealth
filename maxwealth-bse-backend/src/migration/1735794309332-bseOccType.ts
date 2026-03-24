import { MigrationInterface, QueryRunner } from 'typeorm';

export class BseOccType1735794309332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bse_occ_type\` ADD COLUMN \`type\` varchar(300)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_type\` SET \`type\`="Business" WHERE id IN (1,12)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_type\` SET \`type\`="Service" WHERE id IN (2,3,4,9,10,11,13)`,
    );
    await queryRunner.query(
      `UPDATE \`bse_occ_type\` SET \`type\`="Others" WHERE id IN (5,6,7,8,14)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
