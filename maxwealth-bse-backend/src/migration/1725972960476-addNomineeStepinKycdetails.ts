import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNomineeStepinKycdetails1725972960476
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE kyc_status_details
            ADD COLUMN nominee tinyint default 0;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
