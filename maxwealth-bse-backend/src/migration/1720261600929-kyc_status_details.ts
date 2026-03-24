import { MigrationInterface, QueryRunner } from 'typeorm';

export class KycStatusDetails1720261600929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists kyc_status_details (
            id INT AUTO_INCREMENT,
            user_id INT,
            user_onboarding_detail_id INT,
            signzy_kyc_object_id INT,

            pan tinyint default 0,
            full_name tinyint default 0,
            date_of_birth tinyint default 0,
            father_name tinyint default 0,
            mother_name tinyint default 0,
            marital_status tinyint default 0,

            gender tinyint default 0,
            occupation tinyint default 0,
            annual_income tinyint default 0,
            nationality tinyint default 0,
            bank_account_details tinyint default 0,
            self_photo tinyint default 0,
            pan_upload tinyint default 0,
            poa_aadhaar_digilocker tinyint default 0,
            address_details tinyint default 0,
            signature_upload tinyint default 0,
            aadhaar_esign tinyint default 0,


            signzy_poi_poa_link_generated tinyint default 0,
            signzy_poi_poa_updated tinyint default 0,
            signzy_bank_updated tinyint default 0,
            signzy_kyc_data_updated tinyint default 0,
            signzy_fatca_updated tinyint default 0,
            signzy_forensics_updated tinyint default 0,
            signzy_signature_updated tinyint default 0,
            signzy_photo_updated tinyint default 0,
            signzy_generate_pdf tinyint default 0,
            signzy_generate_aadhar_esign_url tinyint default 0,
            signzy_save_aadhar_esign tinyint default 0,

            status varchar(100),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (user_onboarding_detail_id) REFERENCES user_onboarding_details(id),
            FOREIGN KEY (signzy_kyc_object_id) REFERENCES signzy_kyc_objects(id),

            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

    await queryRunner.query(`ALTER TABLE user_onboarding_details
                CHANGE COLUMN kyc_id kyc_id INT;
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
