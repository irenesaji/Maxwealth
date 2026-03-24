import { MigrationInterface, QueryRunner } from 'typeorm';

export class associatedModelPortfolioFund1689619895806
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists model_portfolio_associated_funds (
            id INT AUTO_INCREMENT,
            scheme_isin varchar(40),
            scheme_logo varchar(255),
            scheme_name varchar(255),
            scheme_category varchar(255),
            scheme_asset_class varchar(255),
            allocation_percentage float,
            priority int,
            model_portfolio_id int,
            model_portfolio_fund_id int,
            PRIMARY KEY (id),
            FOREIGN KEY (model_portfolio_id) REFERENCES model_portfolios(id),
            FOREIGN KEY (model_portfolio_fund_id) REFERENCES model_portfolio_funds(id)
        )`);

    await queryRunner.query(`
        ALTER TABLE model_portfolio_funds ADD scheme_logo varchar(255);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
