import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExtraFieldstoAmcs1724316670192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /*
    @Column({name: 'supporting_document'})
    supporting_document:string;

    @Column({name:"status"})
    status:string;    

    @Column({name:"reject_reason"})
    reject_reason:string;

    @Column({name:"approved_by"})
    approved_by:string;
    */
    await queryRunner.query(`ALTER TABLE \`amcs\`
        ADD COLUMN \`supporting_document\` varchar(300),
        ADD COLUMN \`status\` varchar(100),
        ADD COLUMN \`reject_reason\` varchar(500),
        ADD COLUMN \`approved_by\` varchar(100);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
