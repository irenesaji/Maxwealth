import { MigrationInterface, QueryRunner } from 'typeorm';

export class Goalcreation1726746612195 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`user_goals\` (
            \`id\` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
            \`user_id\` int,
            \`goal_id\` int,
            \`goal_name\` varchar(200), 
            \`current_cost\` bigint, 
            \`current_monthly_expenses\` bigint,
            \`retirement_age\` int,
            \`life_expectancy\` int,
            \`expected_inflation\` int, 
            \`target_year\` int, 
            \`expected_returns\` int, 
            FOREIGN KEY (\`user_id\`) REFERENCES users(id) ON DELETE CASCADE, 
            FOREIGN KEY (\`goal_id\`) REFERENCES goals(id) ON DELETE CASCADE, 
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
