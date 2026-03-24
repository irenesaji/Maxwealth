import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkipInstructionsAndSmartSipConfigurationColumns1694231417882
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists sip_skip_instructions (
            id INT AUTO_INCREMENT,
            plan_id varchar(200) not null,
            fp_skip_instruction_id varchar(200) not null,
            from_date date not null,
            to_date date null,
            state varchar(100) ,
            remaining_installments int,
            skipped_installments int default 0,
            cancelled_at DATETIME,
            completed_at DATETIME,
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column track_fund_isin varchar(30);`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column track_fund_attribute varchar(200);`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column attribute_range_start float`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column attribute_range_end float`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column debt_scheme_allocation float`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration add column equity_scheme_allocation float`,
    );
    await queryRunner.query(
      `ALTER TABLE smart_sip_configuration drop column benchmark_threshold `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
