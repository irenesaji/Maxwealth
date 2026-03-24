import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlanFields1717154036491 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column start_date date`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column  end_date date`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column  next_installment_date date`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column  previous_installment_date date`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column remaining_installments int`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column activated_at DATETIME `,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column cancelled_at DATETIME`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column completed_at DATETIME`,
    );
    await queryRunner.query(
      `ALTER TABLE transaction_basket_items add column failed_at DATETIME`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
