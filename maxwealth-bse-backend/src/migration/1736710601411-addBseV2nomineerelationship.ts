import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBseV2nomineerelationship1736710601411
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE bse_v1_relationship_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(2) NOT NULL,
                value VARCHAR(100) NOT NULL
            );
        `);

    // Insert data into the table
    await queryRunner.query(`
            INSERT INTO bse_v1_relationship_codes (code, value) VALUES
            ('01', 'AUNT'),
            ('02', 'BROTHER-IN-LAW'),
            ('03', 'BROTHER'),
            ('04', 'DAUGHTER'),
            ('05', 'DAUGHTER-IN-LAW'),
            ('06', 'FATHER'),
            ('07', 'FATHER-IN-LAW'),
            ('08', 'GRAND DAUGHTER'),
            ('09', 'GRAND FATHER'),
            ('10', 'GRAND MOTHER'),
            ('11', 'GRAND SON'),
            ('12', 'MOTHER-IN-LAW'),
            ('13', 'MOTHER'),
            ('14', 'NEPHEW'),
            ('15', 'NIECE'),
            ('16', 'SISTER'),
            ('17', 'SISTER-IN-LAW'),
            ('18', 'SON'),
            ('19', 'SON-IN-LAW'),
            ('20', 'SPOUSE'),
            ('21', 'UNCLE'),
            ('22', 'OTHERS'),
            ('23', 'COURT APPOINTED LEGAL GUARDIAN');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
