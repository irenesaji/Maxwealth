import { MigrationInterface, QueryRunner } from 'typeorm';

export class SkipInstructionMigration1699273272419
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`Drop table sip_skip_instructions`);

    await queryRunner.query(`CREATE TABLE if not exists sip_skip_instructions (
            id INT AUTO_INCREMENT,
            user_id INT,
            transaction_basket_item_id INT,
            fp_id varchar(100),
            plan varchar(100),
            state varchar(100),
            from_date varchar(100),
            to_date varchar(100),
            remaining_installments INT,
            skipped_installments INT,
            cancelled_at DATETIME,
            completed_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (transaction_basket_item_id) REFERENCES transaction_basket_items (id),
            PRIMARY KEY (id),
            \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
