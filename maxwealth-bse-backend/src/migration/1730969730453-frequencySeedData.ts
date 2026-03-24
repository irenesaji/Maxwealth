import { MigrationInterface, QueryRunner } from 'typeorm';

export class FrequencySeedData1730969730453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`bse_frequency\`(
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`code\` VARCHAR(10),
            \`description\` VARCHAR(200),
            PRIMARY KEY(\`id\`),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            INSERT INTO bse_frequency(code, description)
            VALUES
                ('m', 'Monthly'),
                ('w', 'Weekly'),
                ('d', 'Daily'),
                ('f', 'Fortnightly'),
                ('q', 'Quarterly'),
                ('h', 'Half yearly'),
                ('y', 'Yearly')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
