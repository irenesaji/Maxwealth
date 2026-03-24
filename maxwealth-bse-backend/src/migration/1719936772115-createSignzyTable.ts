import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSignzyTable1719936772115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists signzy_kyc_objects (
            id INT AUTO_INCREMENT,
            user_id INT,
            name varchar(255),
            username varchar(255),
            phone varchar(255),
            password varchar(255),
            initial_namespace varchar(255),
            eventual_namespace varchar(255),
            channel_id varchar(255),
            status varchar(100),
            FOREIGN KEY (user_id) REFERENCES users (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
