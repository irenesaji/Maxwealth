import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRazorPayPennyDrops1721349191172
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE razor_pay_penny_drops (
            id INT AUTO_INCREMENT PRIMARY KEY,
            razorpay_id varchar(225),
            validation_type varchar(75) default 'optimized',
            account_type varchar(75),
            name varchar(225),
            ifsc varchar(225),
            account_number varchar(225),
           
            contact_name varchar(225),
            email varchar(255),
            contact varchar(255),
            user_id int,
            status varchar(75),
            account_status varchar(75),
            registered_name varchar(255),
            details varchar(255),
            name_match_score float,
            status_detail_decription text,
            status_detail_source varchar(255),
            status_detail_reason varchar(255)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
