import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveAmcs1709095568338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create TABLE amcs(
            id INT AUTO_INCREMENT PRIMARY KEY,
            amc_id int NOT NULL,
            name VARCHAR(255) NOT NULL,
            is_active tinyint(1),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );`);

    await queryRunner.query(
      `INSERT INTO amcs VALUES (1,302,'HDFC Mutual',1,'2024-02-28 12:37:48','2024-02-28 12:37:48'),(2,8,'Canara Robeco Mutual Fund',1,'2024-02-28 12:38:07','2024-02-28 12:38:07'),(3,9636,'360 ONE Mutual Fund',1,'2024-02-28 12:38:38','2024-02-28 12:38:38'),(4,12160,'WhiteOak Capital Mutual Fund',1,'2024-02-28 12:43:02','2024-02-28 12:43:02'),(5,181,'DSP ',1,'2024-02-28 12:43:35','2024-02-28 12:43:35'),(6,4,'Aditya Birla Sun Life Mutual Fund',1,'2024-02-28 12:50:22','2024-02-28 12:50:22'),(7,27,'Tata Mutual Fund',1,'2024-02-28 12:50:22','2024-02-28 12:50:22'),(8,10157,'PPFAS Mutual Fund',1,'2024-02-28 12:50:22','2024-02-28 12:50:22'),(9,14,'ICICI Prudential Mutual Fund',1,'2024-02-28 12:50:22','2024-02-28 12:50:22'),(10,11,'Quant Mutual Fund',1,'2024-02-28 12:59:39','2024-02-28 12:59:39'),(11,9055,'PGIM India Mutual Fund',1,'2024-02-28 12:59:43','2024-02-28 12:59:43'),(12,25,'SBI Mutual Fund',1,'2024-02-28 12:59:49','2024-02-28 12:59:49'),(13,24,'Nippon India Mutual Fund',1,'2024-02-28 12:59:49','2024-02-28 12:59:49'),(14,9054,'Motilal Oswal Mutual Fund',1,'2024-02-28 13:01:57','2024-02-28 13:01:57'),(15,311,'UTI Mutual Fund',1,'2024-02-28 13:01:57','2024-02-28 13:01:57'),(16,327,'Mirae Asset Mutual Fund',1,'2024-02-28 13:01:57','2024-02-28 13:01:57'),(17,218,'Kotak Mahindra Mutual Fund',1,'2024-02-28 13:03:11','2024-02-28 13:03:11');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
