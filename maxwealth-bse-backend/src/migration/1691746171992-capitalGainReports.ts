import { MigrationInterface, QueryRunner } from 'typeorm';

export class CapitalGainReports1691746171992 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists capital_gain_reports (
            id INT AUTO_INCREMENT,
            user_id INT,
            month INT,
            year INT,
            report_url varchar(255),
            FOREIGN KEY (user_id) REFERENCES users (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
