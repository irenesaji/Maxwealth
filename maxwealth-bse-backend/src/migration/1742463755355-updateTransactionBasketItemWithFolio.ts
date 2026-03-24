import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransactionBasketItemWithFolio1742463755355
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_basket_items\` 
            ADD COLUMN \`folio_mobile\` varchar(50),
            ADD COLUMN \`folio_email\` varchar(300)
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
