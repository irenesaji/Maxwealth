import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNomineeDetails1680176689457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user_nominee_details\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(200) NOT NULL, 
        \`date_of_birth\` date NOT NULL, 
        \`relationship\` varchar(255) NOT NULL,
        \`allocation_percentage\` int  NULL, 
        \`guardian_name\` varchar(255)  NULL,  
        \`guardian_relationship\` varchar(255)  NULL,
        user_id int not null,PRIMARY KEY (\`id\`),  
        FOREIGN KEY (\`user_id\`) REFERENCES users(id), 
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user_nominee_details\``);
  }
}
