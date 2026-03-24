import { MigrationInterface, QueryRunner } from 'typeorm';

export class TextDocumentTable1734411219648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS text_document (
                id INT AUTO_INCREMENT PRIMARY KEY,
                file_name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS fund_details(
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            uniqueNo VARCHAR(255) UNIQUE NOT NULL,
            schemeCode VARCHAR(255),
            rtaSchemeCode VARCHAR(255),
            amcSchemeCode VARCHAR(255),
            isin VARCHAR(255) NOT NULL,
            amcCode VARCHAR(255),
            schemeType VARCHAR(255),
            schemePlan VARCHAR(255),
            schemeName VARCHAR(255),
            purchaseAllowed BOOLEAN DEFAULT FALSE,
            purchaseTransactionMode VARCHAR(255),
            minimumPurchaseAmount DECIMAL(12,2),
            additionalPurchaseAmount DECIMAL(12,2),
            maximumPurchaseAmount DECIMAL(12,2),
            purchaseAmountMultiplier DECIMAL(12,2),
            purchaseCutoffTime VARCHAR(255),
            redemptionAllowed BOOLEAN DEFAULT FALSE,
            redemptionTransactionMode VARCHAR(255),
            minimumRedemptionQty DECIMAL(12,2),
            redemptionQtyMultiplier DECIMAL(12,2),
            maximumRedemptionQty DECIMAL(12,2),
            redemptionAmountMinimum DECIMAL(12,2),
            redemptionAmountMaximum DECIMAL(20,2),
            redemptionAmountMultiple DECIMAL(12,2),
            redemptionCutoffTime VARCHAR(255),
            rtaAgentCode VARCHAR(255),
            amcActiveFlag BOOLEAN DEFAULT TRUE,
            dividendReinvestmentFlag BOOLEAN DEFAULT FALSE,
            sipFlag BOOLEAN DEFAULT FALSE,
            stpFlag BOOLEAN DEFAULT FALSE,
            swpFlag BOOLEAN DEFAULT FALSE,
            switchFlag BOOLEAN DEFAULT FALSE,
            settlementType VARCHAR(255),
            amcInd VARCHAR(255),
            faceValue DECIMAL(12,2),
            startDate DATE,
            endDate DATE,
            exitLoadFlag BOOLEAN DEFAULT FALSE,
            exitLoad TEXT,
            lockInPeriodFlag BOOLEAN DEFAULT FALSE,
            lockInPeriod VARCHAR(255),
            channelPartnerCode VARCHAR(255),
            reopeningDate DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
