import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserReturnsHistoryV21745821141047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists user_returns_history_v2 (
            id INT AUTO_INCREMENT,
            user_id INT,
            day_change_amount float,
            day_change_percentage float,
            date DATE,
            FOREIGN KEY (user_id) REFERENCES users (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
