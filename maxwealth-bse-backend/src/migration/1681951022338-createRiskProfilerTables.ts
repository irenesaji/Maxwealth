import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRiskProfilerTables1681951022338
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`risk_profiles\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(100) NOT NULL, 
            \`description\` text  NULL,  
            \`low\` float not  NULL,
            \`high\` float NOT NULL,
            \`is_active\` tinyint  NOT NULL default true,

            \`display_equity_allocation\` varchar(255) NOT NULL,
            \`min_equity_allocation\` float NOT NULL,
            \`max_equity_allocation\` float NOT NULL , 

            \`display_debt_allocation\` varchar(255) NOT NULL,
            \`min_debt_allocation\` float NOT NULL,
            \`max_debt_allocation\` float NOT NULL , 

            \`display_liquid_allocation\` varchar(255) NOT NULL,
            \`min_liquid_allocation\` float NOT NULL,
            \`max_liquid_allocation\` float NOT NULL , 

            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (\`id\`))
            `);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`risk_profile_questions\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`question\` text NOT NULL, 
            \`description\` text  NULL,  
            \`is_active\` tinyint  NOT NULL default true, 
            PRIMARY KEY (\`id\`),    
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`risk_answer_weightages\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`weightage\` float NOT NULL, 
            PRIMARY KEY (\`id\`),  
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`risk_answer_choices\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`risk_profile_question_id\` int NOT NULL, 
            \`risk_answer_weightage_id\` int NOT NULL, 
            \`answer\` varchar(255) NOT NULL, 
            \`answer_image_url\` varchar(255)  NULL, 
            \`position\` int  NULL, 
            PRIMARY KEY (\`id\`),  
            FOREIGN KEY (\`risk_profile_question_id\`) REFERENCES risk_profile_questions(id),
            FOREIGN KEY (\`risk_answer_weightage_id\`) REFERENCES risk_answer_weightages(id), 
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`risk_user_quizes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`risk_profile_question_id\` int NOT NULL, 
                \`risk_answer_choice_id\` int NOT NULL, 
                \`score\` float NOT NULL, 
                \`user_id\` int not null,
                PRIMARY KEY (\`id\`),  
                FOREIGN KEY (\`risk_profile_question_id\`) REFERENCES risk_profile_questions(id),
                FOREIGN KEY (\`risk_answer_choice_id\`) REFERENCES risk_answer_choices(id), 
                FOREIGN KEY (\`user_id\`) REFERENCES users(id), 
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
                \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`risk_user_quizes\``);
    await queryRunner.query(`DROP TABLE \`risk_answer_choices\``);
    await queryRunner.query(`DROP TABLE \`risk_answer_weightages\``);
    await queryRunner.query(`DROP TABLE \`risk_profile_questions\``);
    await queryRunner.query(`DROP TABLE \`risk_profiles\``);
  }
}
