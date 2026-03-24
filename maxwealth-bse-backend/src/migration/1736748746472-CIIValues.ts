import { MigrationInterface, QueryRunner } from 'typeorm';

export class CIIValues1736748746472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE cost_inflation_index (
              id INT PRIMARY KEY AUTO_INCREMENT,
              financial_year INT,
              cost_inflation_index INT
            );
          `);

    // Insert the values
    await queryRunner.query(`
            INSERT INTO cost_inflation_index (id, financial_year, cost_inflation_index) VALUES
              (1, '2002', 100),
              (2, '2003', 105),
              (3, '2004', 109),
              (4, '2005', 113),
              (5, '2006', 117),
              (6, '2007', 122),
              (7, '2008', 129),
              (8, '2009', 137),
              (9, '2010', 148),
              (10, '2011', 167),
              (11, '2012', 184),
              (12, '2013', 200),
              (13, '2014', 220),
              (14, '2015', 240),
              (15, '2016', 254),
              (16, '2017', 264),
              (17, '2018', 272),
              (18, '2019', 280),
              (19, '2020', 289),
              (20, '2021', 301),
              (21, '2022', 317),
              (22, '2023', 331),
              (23, '2024', 348),
              (24, '2025', 363);
          `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
