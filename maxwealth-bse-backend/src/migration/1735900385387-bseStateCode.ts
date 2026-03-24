import { MigrationInterface, QueryRunner } from 'typeorm';

export class BseStateCode1735900385387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE bse_state_and_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            state VARCHAR(100),
            code VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`);

    await queryRunner.query(`INSERT INTO bse_state_and_codes (state, code) VALUES
            ('Andaman & Nicobar', 'AN'),
            ('Arunachal Pradesh', 'AR'),
            ('Andhra Pradesh', 'AP'),
            ('Assam', 'AS'),
            ('Bihar', 'BH'),
            ('Chandigarh', 'CH'),
            ('Chhattisgarh', 'CG'),
            ('GOA', 'GO'),
            ('Gujarat', 'GU'),
            ('Haryana', 'HA'),
            ('Himachal Pradesh', 'HP'),
            ('Jammu & Kashmir', 'JM'),
            ('Jharkhand', 'JK'),
            ('Karnataka', 'KA'),
            ('Kerala', 'KE'),
            ('Madhya Pradesh', 'MP'),
            ('Maharashtra', 'MA'),
            ('Manipur', 'MN'),
            ('Meghalaya', 'ME'),
            ('Mizoram', 'MI'),
            ('Nagaland', 'NA'),
            ('New Delhi', 'ND'),
            ('Orissa', 'OR'),
            ('Pondicherry', 'PO'),
            ('Punjab', 'PU'),
            ('Rajasthan', 'RA'),
            ('Sikkim', 'SI'),
            ('Telangana', 'TG'),
            ('Tamil Nadu', 'TN'),
            ('Tripura', 'TR'),
            ('Uttar Pradesh', 'UP'),
            ('Uttaranchal', 'UC'),
            ('West Bengal', 'WB'),
            ('Dadra and Nagar Haveli', 'DN'),
            ('Daman and Diu', 'DD'),
            ('Lakshadweep', 'LD'),
            ('Others', 'OH');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
