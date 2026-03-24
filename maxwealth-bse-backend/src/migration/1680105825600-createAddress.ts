import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAddress1680105825600 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user_address_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pincode\` varchar(10) NOT NULL,  \`line_1\` varchar(255) NOT NULL, \`line_2\` varchar(255)  NULL, \`line_3\` varchar(255)  NULL,
         \`city\` varchar(80) not null, \`state\` varchar(80) not null,user_id int not null,PRIMARY KEY (\`id\`),   FOREIGN KEY (\`user_id\`) REFERENCES users(id),  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_address_details\``);
  }
}
