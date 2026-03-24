import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFileIdsToOnboarding1680307554236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_photo_file_id varchar(256) null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_video_file_id varchar(256) null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_signature_file_id varchar(256) null`,
    );

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` MODIFY photo_url TEXT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` MODIFY video_url TEXT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` MODIFY signature_url TEXT`,
    );

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column lat float null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column lng float null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column aadhaar_number varchar(10) null`,
    );

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_esign_id varchar(256) null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_esign_status varchar(30) null`,
    );

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_kyc_status varchar(30) null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_kyc_reject_reasons text null`,
    );

    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_investor_id int null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_investment_account_old_id int null`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` ADD column fp_investment_account_id  varchar(256) null`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` drop column fp_photo_file_id`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` drop column fp_video_file_id`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_details\` drop column fp_signature_file_id`,
    );
  }
}
