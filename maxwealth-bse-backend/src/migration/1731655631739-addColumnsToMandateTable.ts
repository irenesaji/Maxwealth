import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnsToMandateTable1731655631739
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`bse_mandates\`(
            \`id\` INT AUTO_INCREMENT PRIMARY KEY,
            \`ucc\` varchar(100),
            \`mem_code\` varchar(200),
            \`max_txn_amt\` int,
            \`cur\` varchar(200),
            \`start_date\` Date,
            \`valid_till\` Date,
            \`details\` json,
            \`mode\` varchar(255),
            \`debit_type\` varchar(200),
            \`man_2fa\` varchar(200),
            \`mandate_id\` int,
            FOREIGN KEY(mandate_id) REFERENCES mandates(id) ON DELETE CASCADE,
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
