import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingFieldsToRzpOrders1724844754236
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`rzp_orders\`
        ADD COLUMN \`user_id\` int,
        ADD COLUMN \`transaction_basket_id\` int;
        `);
    await queryRunner.query(`ALTER TABLE rzp_transfers
        ADD COLUMN recipient_details JSON;`);

    await queryRunner.query(`ALTER TABLE rzp_transfers
            ADD COLUMN rzp_order_id varchar(100);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
