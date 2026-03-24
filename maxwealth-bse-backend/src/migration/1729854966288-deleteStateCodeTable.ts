import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteStateCodeTable1729854966288 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE state_code`);

    await queryRunner.query(`ALTER TABLE state_and_codes 
            ADD COLUMN karvy_state_name VARCHAR(255),
            ADD COLUMN karvy_state_code VARCHAR(255)
            `);

    await queryRunner.query(`
                INSERT INTO state_and_codes(karvy_state_code, karvy_state_name)
                VALUES
                    (01, 'Andhra Pradesh'),
                    (02, 'Arunachal Pradesh'),
                    (03, 'Assam'),
                    (04, 'Bihar'),
                    (05, 'Chandigarh'),
                    (06, 'Delhi'),
                    (07, 'Goa'),
                    (08, 'Gujarat'),
                    (09, 'Haryana'),
                    (10, 'Himachal Pradesh'),
                    (11, 'Jammu And Kashmir'),
                    (12, 'Karnataka'),
                    (13, 'Kerala'),
                    (14, 'Madhya Pradesh'),
                    (15, 'Maharashtra'),
                    (16, 'Manipur'),
                    (17, 'Meghalaya'),
                    (18, 'Mizoram'),
                    (19, 'Nagaland'),
                    (20, 'Orissa'),
                    (21, 'Punjab'),
                    (22, 'Rajasthan'),
                    (23, 'Tamil Nadu'),
                    (24, 'Tripura'),
                    (25, 'Uttar Pradesh'),
                    (26, 'West Bengal'),
                    (27, 'Others'),
                    (28, 'Telangana'),
                    ('SI', 'Sikkim')
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
