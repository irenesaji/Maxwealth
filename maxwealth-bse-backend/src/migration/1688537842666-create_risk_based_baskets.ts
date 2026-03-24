import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRiskBasedBaskets1688537842666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists model_portfolios (
            id INT AUTO_INCREMENT,
            name varchar(40),
            description text null,
            PRIMARY KEY (id)
        )`);

    await queryRunner.query(`CREATE TABLE if not exists model_portfolio_funds (
            id INT AUTO_INCREMENT,
            scheme_isin varchar(40),
            scheme_name varchar(255),
            scheme_category varchar(255),
            scheme_asset_class varchar(255),
            allocation_percentage float,
            priority int,
            model_portfolio_id int,
            PRIMARY KEY (id),
            FOREIGN KEY (model_portfolio_id) REFERENCES model_portfolios (id)
        )`);

    await queryRunner.query(`CREATE TABLE if not exists goals (
            id INT AUTO_INCREMENT,
            name varchar(40),
            description text null,
            icon varchar(255),
            model_portfolio_id int null,
            FOREIGN KEY (model_portfolio_id) REFERENCES model_portfolios (id),
            PRIMARY KEY (id)
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
