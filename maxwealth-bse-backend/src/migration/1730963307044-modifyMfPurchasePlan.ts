import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMfPurchasePlan1730963307044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE mf_purchase_plans 
            MODIFY frequency VARCHAR(200)
            ;`);

    await queryRunner.query(`ALTER TABLE mf_purchase_plans 
            ADD COLUMN sxp_type varchar(200),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN amc_code varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN phys_or_demat varchar(200),
            ADD COLUMN isunits tinyint,
            ADD COLUMN dpc tinyint,
            ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN sub_br_code varchar(200),
            ADD COLUMN sub_br_arn varchar(200),
            ADD COLUMN partner_id varchar(200),
            ADD COLUMN remark varchar(200),
            ADD COLUMN first_order_today tinyint,
            ADD COLUMN brokerage int
            `);

    await queryRunner.query(`ALTER TABLE purchases 
            ADD COLUMN src varchar(200),
            ADD COLUMN type varchar(50),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN is_units tinyint,
            ADD COLUMN all_units tinyint,
            ADD COLUMN is_fresh tinyint,
            ADD COLUMN phys_or_demat varchar(200),
             ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN min_redeem_flag tinyint,
            ADD COLUMN info_src varchar(200),
            ADD COLUMN reg_no varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN exch_mandate_id int,
            ADD COLUMN kyc_passed tinyint,
            ADD COLUMN dpc tinyint
            `);

    await queryRunner.query(`ALTER TABLE redemptions
            ADD COLUMN src varchar(200),
            ADD COLUMN type varchar(50),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN is_units tinyint,
            ADD COLUMN all_units tinyint,
            ADD COLUMN is_fresh tinyint,
            ADD COLUMN phys_or_demat varchar(200),
            ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN min_redeem_flag tinyint,
            ADD COLUMN info_src varchar(200),
            ADD COLUMN reg_no varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN exch_mandate_id int,
            ADD COLUMN kyc_passed tinyint,
            ADD COLUMN dpc tinyint
            `);

    await queryRunner.query(`ALTER TABLE mf_redemption_plans 
            ADD COLUMN sxp_type varchar(200),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN amc_code varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN phys_or_demat varchar(200),
            ADD COLUMN isunits tinyint,
            ADD COLUMN dpc tinyint,
            ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN sub_br_code varchar(200),
            ADD COLUMN sub_br_arn varchar(200),
            ADD COLUMN partner_id varchar(200),
            ADD COLUMN remark varchar(200),
            ADD COLUMN first_order_today tinyint,
            ADD COLUMN brokerage int
            `);

    await queryRunner.query(`ALTER TABLE switch_funds 
            ADD COLUMN src varchar(200),
            ADD COLUMN type varchar(50),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN is_units tinyint,
            ADD COLUMN all_units tinyint,
            ADD COLUMN is_fresh tinyint,
            ADD COLUMN phys_or_demat varchar(200),
            ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN min_redeem_flag tinyint,
            ADD COLUMN info_src varchar(200),
            ADD COLUMN reg_no varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN exch_mandate_id int,
            ADD COLUMN kyc_passed tinyint,
            ADD COLUMN dpc tinyint
            `);

    await queryRunner.query(`ALTER TABLE mf_switch_plans 
            ADD COLUMN sxp_type varchar(200),
            ADD COLUMN mem_ord_ref_id varchar(200),
            ADD COLUMN ucc varchar(200),
            ADD COLUMN member varchar(200),
            ADD COLUMN amc_code varchar(200),
            ADD COLUMN cur varchar(200),
            ADD COLUMN dest_folio varchar(200),
            ADD COLUMN phys_or_demat varchar(200),
            ADD COLUMN isunits tinyint,
            ADD COLUMN dpc tinyint,
            ADD COLUMN payment_ref_id varchar(200),
            ADD COLUMN euin_flag tinyint,
            ADD COLUMN sub_br_code varchar(200),
            ADD COLUMN sub_br_arn varchar(200),
            ADD COLUMN partner_id varchar(200),
            ADD COLUMN remark varchar(200),
            ADD COLUMN first_order_today tinyint,
            ADD COLUMN brokerage int
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
