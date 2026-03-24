import { MigrationInterface, QueryRunner } from 'typeorm';

export class KarvyRelationshipSeed1728390093110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO karvy_relationship (karvy_id, relationship)
            VALUES
                (1, 'Father'),
                (2, 'Mother'),
                (3, 'Court Appointed Legal Guardian'),
                (4, 'Aunt'),
                (5, 'Brother-in-law'),
                (6, 'Brother'),
                (7, 'Daughter'),
                (8, 'Daughter-in-law'),
                (9, 'Father-in-law'),
                (10, 'Grand Daughter'),
                (11, 'Grand Father'),
                (12, 'Grand Mother'),
                (13, 'Grand Son'),
                (14, 'Mother-in-law'),
                (15, 'Nephew'),
                (16, 'Niece'),
                (17, 'Sister'),
                (18, 'Sister-in-law'),
                (19, 'Son'),
                (20, 'Son-in-law'),
                (21, 'Spouse'),
                (22, 'Uncle'),
                (23, 'Others')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
