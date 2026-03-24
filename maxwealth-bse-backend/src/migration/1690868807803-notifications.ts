import { MigrationInterface, QueryRunner } from 'typeorm';

export class notifications1690868807803 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE if not exists notifications (
            id INT AUTO_INCREMENT,
            user_id INT,
            icon varchar(256) null,
            title varchar(256),
            body text,
            is_read tinyint not null default 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
