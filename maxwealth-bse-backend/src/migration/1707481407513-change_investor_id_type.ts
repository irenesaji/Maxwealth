import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeInvestorIdType1707481407513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE user_onboarding_details MODIFY fp_investor_id varchar(255);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
