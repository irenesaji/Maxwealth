import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserReturnsHistoryV2Update1745833026303
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_returns_history_v2\`
            ADD COLUMN \`total_returns\` float,
            ADD COLUMN \`total_returns_percentage\` float  
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
