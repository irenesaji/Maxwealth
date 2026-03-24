import { MigrationInterface, QueryRunner } from 'typeorm';

export class smartSips1689738932330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists smart_sip_funds (
            id INT AUTO_INCREMENT,

            equity_scheme_isin varchar(40),
            equity_scheme_logo varchar(255),
            equity_scheme_name varchar(255),
            equity_scheme_category varchar(255),
            equity_scheme_asset_class varchar(255),


            debt_scheme_isin varchar(40),
            debt_scheme_logo varchar(255),
            debt_scheme_name varchar(255),
            debt_scheme_category varchar(255),
            debt_scheme_asset_class varchar(255),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

    await queryRunner.query(`CREATE TABLE if not exists smart_sip_configuration (
            id INT AUTO_INCREMENT,
            benchmark_threshold float,
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
