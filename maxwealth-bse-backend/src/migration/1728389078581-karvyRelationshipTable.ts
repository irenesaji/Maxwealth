import { MigrationInterface, QueryRunner } from 'typeorm';

export class KarvyRelationshipTable1728389078581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`karvy_relationship\`(
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`karvy_id\` INT,
            \`relationship\` VARCHAR(300),
            PRIMARY KEY(\`id\`),
            \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
