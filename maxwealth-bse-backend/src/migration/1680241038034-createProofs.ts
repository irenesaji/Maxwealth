import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProofs1680241038034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`proofs\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`type\` varchar(100) NOT NULL, 
            \`document_type\` varchar(100) NOT NULL,  
            \`document_id_number\` varchar(255)  NULL,
            \`fp_front_document_url\` text NOT NULL,
            \`fp_back_document_url\` text  NULL,
            \`front_document_path\` varchar(255) NOT NULL,
            \`back_document_path\` varchar(255)  NULL,
            \`fp_front_side_file_id\` varchar(255)  NULL, 
            \`fp_back_side_file_id\` varchar(255)  NULL,  
            \`proof_issue_date\` Date  NULL,  
            \`proof_expiry_date\` Date  NULL,  
            user_id int not null,
            PRIMARY KEY (\`id\`),  
            FOREIGN KEY (\`user_id\`) REFERENCES users(id), 
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`proofs\``);
  }
}
