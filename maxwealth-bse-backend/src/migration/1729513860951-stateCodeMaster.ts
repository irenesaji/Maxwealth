import { MigrationInterface, QueryRunner } from 'typeorm';

export class StateCodeMaster1729513860951 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`state_code\`(
            \`id\` INT NOT NULL AUTO_INCREMENT,
            \`code\` VARCHAR(10),
            \`state\` VARCHAR(300),
            PRIMARY KEY(\`id\`),
            \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB
        `);

    await queryRunner.query(`
            INSERT INTO state_code(code, state)
            VALUES
                (01, 'Andhra Pradesh'),
                (02, 'Arunachal Pradesh'),
                (03, 'Assam'),
                (04, 'Bihar'),
                (05, 'Chandigarh'),
                (06, 'Delhi'),
                (07, 'Goa'),
                (08, 'Gujarat'),
                (09, 'Haryana'),
                (10, 'Himachal Pradesh'),
                (11, 'Jammu And Kashmir'),
                (12, 'Karnataka'),
                (13, 'Kerala'),
                (14, 'Madhya Pradesh'),
                (15, 'Maharashtra'),
                (16, 'Manipur'),
                (17, 'Meghalaya'),
                (18, 'Mizoram'),
                (19, 'Nagaland'),
                (20, 'Orissa'),
                (21, 'Punjab'),
                (22, 'Rajasthan'),
                (23, 'Tamil Nadu'),
                (24, 'Tripura'),
                (25, 'Uttar Pradesh'),
                (26, 'West Bengal'),
                (27, 'Others'),
                (28, 'Telangana'),
                ('SI', 'Sikkim')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
