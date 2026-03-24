import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddcolumnsToOccupation1729501338419 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE occupations 
            ADD COLUMN karvy_occupation_code varchar(10),
            ADD COLUMN karvy_occupation_description varchar(200),
            ADD COLUMN karvy_occupation_identifier varchar(200)`);

    await queryRunner.query(`INSERT INTO occupations (karvy_occupation_code, karvy_occupation_description,karvy_occupation_identifier) VALUES
                        ('01', 'Service','service'),
                        ('02', 'Business','business'),
                        ('03', 'Student','student'),
                        ('04', 'Household','household'),
                        ('06', 'Professional','professional'),
                        ('07', 'Farmer','farmer'),
                        ('08', 'Retired','retired'),
                        ('09', 'Others','others');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
