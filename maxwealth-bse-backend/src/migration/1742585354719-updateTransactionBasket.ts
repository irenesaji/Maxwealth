import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTransactionBasket1742585354719
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transaction_baskets\`
                ADD COLUMN \`payment_page\` text
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
