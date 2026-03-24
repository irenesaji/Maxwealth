import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnumsForBse1731173488970 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE bse_holding_nature (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(2) UNIQUE NOT NULL,
            description VARCHAR(50) NOT NULL
         )
        `);

    await queryRunner.query(`
            INSERT INTO bse_holding_nature (code, description) VALUES 
            ('SI', 'Single'),
            ('JO', 'Joint'),
            ('AS', 'Anyone or Survivor')
        `);

    await queryRunner.query(`
            CREATE TABLE bse_tax_status (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tax_code VARCHAR(2) UNIQUE NOT NULL,
            tax_status VARCHAR(100) NOT NULL
            )
        `);

    // Insert initial data
    await queryRunner.query(`
             INSERT INTO bse_tax_status (tax_code, tax_status) VALUES
            ('01', 'Individual'),
            ('02', 'On behalf of minor'),
            ('03', 'HUF'),
            ('04', 'Company'),
            ('05', 'AOP'),
            ('06', 'Partnership Firm'),
            ('07', 'Body Corporate'),
            ('08', 'Trust'),
            ('09', 'Society'),
            ('10', 'Others'),
            ('11', 'NRI-Others'),
            ('12', 'DFI'),
            ('13', 'Sole Proprietorship'),
            ('21', 'NRE'),
            ('22', 'OCB'),
            ('23', 'FII'),
            ('24', 'NRO'),
            ('25', 'Overseas Corp. Body - Others'),
            ('26', 'NRI Child'),
            ('27', 'NRI - HUF (NRO)'),
            ('28', 'NRI - Minor (NRO)'),
            ('29', 'NRI - HUF (NRE)'),
            ('31', 'Provident Fund'),
            ('32', 'Super Annuation Fund'),
            ('33', 'Gratuity Fund'),
            ('34', 'Pension Fund'),
            ('36', 'Mutual Funds FOF Schemes'),
            ('37', 'NPS Trust'),
            ('38', 'Global Development Network'),
            ('39', 'FCRA'),
            ('41', 'QFI - Individual'),
            ('42', 'QFI - Minors'),
            ('43', 'QFI - Corporate'),
            ('44', 'QFI - Pension Funds'),
            ('45', 'QFI - Hedge Funds'),
            ('46', 'QFI - Mutual Funds'),
            ('47', 'LLP'),
            ('48', 'Non-Profit organization [NPO]'),
            ('51', 'Public Limited Company'),
            ('52', 'Private Limited Company'),
            ('53', 'Unlisted Company'),
            ('54', 'Mutual Funds'),
            ('55', 'FPI - Category I'),
            ('56', 'FPI - Category II'),
            ('57', 'FPI - Category III'),
            ('58', 'Financial Institutions'),
            ('59', 'Body of Individuals'),
            ('60', 'Insurance Company'),
            ('61', 'OCI - Repatriation'),
            ('62', 'OCI - Non Repatriation'),
            ('70', 'Person of Indian Origin'),
            ('72', 'Government Body'),
            ('73', 'Defense Establishment'),
            ('74', 'Non - Government Organisation'),
            ('75', 'Bank/Co-Operative Bank'),
            ('76', 'Artificial Juridical person'),
            ('77', 'Seafarer NRE'),
            ('78', 'Seafarer NRO')
        `);

    await queryRunner.query(`
      CREATE TABLE bse_rdmp_idcw_pay_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(2) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_rdmp_idcw_pay_mode (code, description) VALUES
      ('01', 'Cheque'),
      ('02', 'Direct Credit'),
      ('03', 'Electronic Clearing Service'),
      ('04', 'National Electronic Fund Transfer'),
      ('05', 'Real-Time Gross Settlement')
    `);

    // Create nomination_auth_mode table
    await queryRunner.query(`
      CREATE TABLE bse_nomination_auth_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_nomination_auth_mode (code, description) VALUES
      ('W', 'Wet Signature'),
      ('E', 'Aadhaar ESign'),
      ('O', 'OTP Authentication')
    `);

    // Create comm_mode table
    await queryRunner.query(`
      CREATE TABLE bse_comm_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_comm_mode (code, description) VALUES
      ('P', 'Physical'),
      ('M', 'Mobile'),
      ('E', 'Email')
    `);

    // Create onboarding table
    await queryRunner.query(`
      CREATE TABLE bse_onboarding (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_onboarding (code, description) VALUES
      ('Z', 'Paperless'),
      ('P', 'Paper(physical)')
    `);

    // Create holder_rank table
    await queryRunner.query(`
      CREATE TABLE bse_holder_rank (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_holder_rank (code, description) VALUES
      (1, 'First/Primary Holder'),
      (2, 'Second Holder'),
      (3, 'Third Holder'),
      (-1, 'Guardian')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_occ_code (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(2) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_occ_code (code, description) VALUES
      ('1', 'Business'),
      ('2', 'Service'),
      ('3', 'Professional'),
      ('4', 'Agriculturist'),
      ('5', 'Retired'),
      ('6', 'Housewife'),
      ('7', 'Student'),
      ('8', 'Others'),
      ('9', 'Doctor'),
      ('41', 'Private Sector Service'),
      ('42', 'Public Sector Service'),
      ('43', 'Forex Dealer'),
      ('44', 'Government Service'),
      ('99', 'Unknown / Not Applicable')
    `);

    // Create auth_mode table
    await queryRunner.query(`
      CREATE TABLE bse_auth_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(20) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_auth_mode (code, description) VALUES
      ('M', 'Mobile'),
      ('E', 'Email'),
      ('B', 'Both')
    `);

    // Create pan_exempt_category table
    await queryRunner.query(`
      CREATE TABLE bse_pan_exempt_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(2) UNIQUE NOT NULL,
        description VARCHAR(100) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_pan_exempt_category (code, description) VALUES
      ('01', 'Sikkim Resident'),
      ('02', 'Transactions carried out on behalf of STATE GOVT'),
      ('03', 'Transactions carried out on behalf of CENTRAL GOVT'),
      ('04', 'COURT APPOINTED OFFICIALS'),
      ('05', 'UN Entity/Multilateral agency exempt from paying tax in India'),
      ('06', 'Official Liquidator'),
      ('07', 'Court Receiver'),
      ('08', 'Investment in Mutual Funds Up to Rs. 50,000/- p.a. including SIP')
    `);

    // Create kyc_type table
    await queryRunner.query(`
      CREATE TABLE bse_kyc_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(30) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_kyc_type (code, description) VALUES
      ('K', 'KRA Compliant'),
      ('C', 'CKYC Compliant'),
      ('B', 'BIOMETRIC KYC'),
      ('E', 'Aadhaar EKYC PAN')
    `);

    // Create bank_acc_type table
    await queryRunner.query(`
      CREATE TABLE bse_bank_acc_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(2) UNIQUE NOT NULL,
        description VARCHAR(30) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_bank_acc_type (code, description) VALUES
      ('SB', 'Savings account'),
      ('CB', 'Current account'),
      ('NE', 'NRE account'),
      ('NO', 'NRO account')
    `);

    // Create bank_acc_owner table
    await queryRunner.query(`
      CREATE TABLE bse_bank_acc_owner (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        description VARCHAR(30) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_bank_acc_owner (code, description) VALUES
      ('SELF', 'Self'),
      ('GUARDIAN', 'Guardian')
    `);

    // Create depository_code table
    await queryRunner.query(`
      CREATE TABLE bse_depository_code (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(4) UNIQUE NOT NULL,
        description VARCHAR(10) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_depository_code (code, description) VALUES
      ('NSDL', 'NSDL'),
      ('CDSL', 'CDSL')
    `);

    // Create whose_contact_number / whose_email_address table
    await queryRunner.query(`
      CREATE TABLE bse_whose_contact_number (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(2) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_whose_contact_number (code, description) VALUES
      ('SE', 'Self'),
      ('SP', 'Spouse'),
      ('DC', 'Dependent Children'),
      ('DS', 'Dependent Siblings'),
      ('DP', 'Dependent Parents'),
      ('GD', 'Guardian'),
      ('PM', 'PMS'),
      ('CD', 'Custodian'),
      ('PO', 'POA')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_contact_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(2) UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_contact_type (code, description) VALUES
      ('RE', 'Residential'),
      ('OF', 'Office'),
      ('PR', 'Primary'),
      ('OT', 'Other')
    `);

    // Create nomination_relation table
    await queryRunner.query(`
      CREATE TABLE bse_nomination_relation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT UNIQUE NOT NULL,
        description VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_nomination_relation (code, description) VALUES
      (1, 'Aunt'),
      (2, 'Brother'),
      (3, 'Daughter'),
      (4, 'Daughter In Law'),
      (5, 'Father'),
      (6, 'Father In Law'),
      (7, 'Grand Daughter'),
      (8, 'Grand Son'),
      (9, 'Grand Father'),
      (10, 'Grand Mother'),
      (11, 'Husband'),
      (12, 'Mother'),
      (13, 'Mother In Law'),
      (14, 'Nephew'),
      (15, 'Niece'),
      (16, 'Friend'),
      (17, 'Sister'),
      (18, 'Son'),
      (19, 'Son In Law'),
      (20, 'Uncle'),
      (21, 'Wife'),
      (22, 'Others')
    `);

    // Create gender table
    await queryRunner.query(`
      CREATE TABLE bse_gender (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(10) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_gender (code, description) VALUES
      ('M', 'Male'),
      ('F', 'Female'),
      ('O', 'Other')
    `);

    // Create identifier_type table
    await queryRunner.query(`
      CREATE TABLE bse_identifier_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(100) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_identifier_type (code, description) VALUES
      ('lei', 'Legal Entity Identifier'),
      ('pan', 'Permanent Account Number'),
      ('cancel_cheque', 'Cancelled Cheque'),
      ('bank_statement', 'Bank Statement'),
      ('cml_copy', 'CML Copy'),
      ('aadhar_card', 'Aadhaar Card'),
      ('passport', 'Passport'),
      ('euin', 'EUIN'),
      ('aof', 'Account Opening Form'),
      ('aof_ria', 'Account Opening Form for RIA members')
    `);

    // Create address_type table
    await queryRunner.query(`
      CREATE TABLE bse_address_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT UNIQUE NOT NULL,
        description VARCHAR(100) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_address_type (code, description) VALUES
      (1, 'Residential or Business'),
      (2, 'Residential'),
      (3, 'Business'),
      (4, 'Registered Office'),
      (5, 'Unspecified')
    `);

    // Create occ_type table
    await queryRunner.query(`
      CREATE TABLE bse_occ_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(30) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_occ_type (code, description) VALUES
      ('B', 'Business'),
      ('S', 'Service'),
      ('O', 'Others')
    `);

    // Create exemption_code table
    await queryRunner.query(`
      CREATE TABLE bse_exemption_code (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) UNIQUE NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_exemption_code (code, description) VALUES
      ('A', 'An organization exempt from tax under section 501(a) or any individual retirement plan as defined in section 7701(a)(37)'),
      ('B', 'The United States or any of its agencies or instrumentalities'),
      ('C', 'A state, the District of Columbia, a possession of the United States, or any of their political subdivisions or instrumentalities'),
      ('D', 'A corporation the stock of which is regularly traded on one or more established securities markets, as described in Reg. section 1.1472-1(c)(1)(i)'),
      ('E', 'A corporation that is a member of the same expanded affiliated group as a corporation described in Reg. section 1.1472-1(c)(1)(i)'),
      ('F', 'A dealer in securities, commodities, or derivative financial instruments (including notional principal contracts, futures, forwards, and options) that is registered as such under the laws of the United States or any state'),
      ('G', 'A real estate investment trust'),
      ('H', 'A regulated investment company as defined in section 851 or an entity registered at all times during the tax year under the Investment Company Act of 1940'),
      ('I', 'A common trust fund as defined in section 584(a)'),
      ('J', 'A bank as defined in section 581'),
      ('K', 'A broker'),
      ('L', 'A trust exempt from tax under section 664 or described in section 4947(a)(1)'),
      ('M', 'A tax exempt trust under a section 403(b) plan or section 457(g) plan'),
      ('N', 'Not Applicable')
    `);

    // Create corporate_service_sector table
    await queryRunner.query(`
      CREATE TABLE bse_corporate_service_sector (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT UNIQUE NOT NULL,
        description VARCHAR(100) NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO bse_corporate_service_sector (code, description) VALUES
      (1, 'Foreign Exchange/Money Changer Services'),
      (2, 'Gaming/Gambling/Lottery Services'),
      (3, 'Money Laundering/Pawning'),
      (4, 'Not Applicable')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_wealth_source (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_wealth_source
    await queryRunner.query(`
      INSERT INTO bse_wealth_source (code, description) VALUES
      (1, 'Salary'),
      (2, 'Business Income'),
      (3, 'Gift'),
      (4, 'Ancestral Property'),
      (5, 'Rental Income'),
      (6, 'Prize Money'),
      (7, 'Royalty'),
      (8, 'Others')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_income_slab (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code INT NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_income_slab
    await queryRunner.query(`
      INSERT INTO bse_income_slab (code, description) VALUES
      (31, 'Below 1 Lakh'),
      (32, '> 1 <=5 Lacs'),
      (33, '>5 <=10 Lacs'),
      (34, '>10 <= 25 Lacs'),
      (35, '> 25 Lacs <= 1 Crore'),
      (36, 'Above 1 Crore')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_politically_exposed (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_politically_exposed
    await queryRunner.query(`
      INSERT INTO bse_politically_exposed (code, description) VALUES
      ('Y', 'The investor is politically exposed person'),
      ('N', 'The investor is not politically exposed person'),
      ('R', 'If the investor is a relative of the politically exposed person')
    `);

    // Create the data_source table
    await queryRunner.query(`
      CREATE TABLE bse_data_source (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_data_source
    await queryRunner.query(`
      INSERT INTO bse_data_source (code, description) VALUES
      ('P', 'Physical'),
      ('E', 'Electronically')
    `);

    // Create the ffi_drnfe table
    await queryRunner.query(`
      CREATE TABLE bse_ffi_drnfe (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_ffi_drnfe
    await queryRunner.query(`
      INSERT INTO bse_ffi_drnfe (code, description) VALUES
      ('FFI', 'FFI'),
      ('DRNFE', 'DRNFE')
    `);

    // Create the bse_is_giin_avail table
    await queryRunner.query(`
      CREATE TABLE bse_is_giin_avail (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_is_giin_avail
    await queryRunner.query(`
      INSERT INTO bse_is_giin_avail (code, description) VALUES
      ('AF', 'Applied for'),
      ('NR', 'Not required to apply for'),
      ('NO', 'Not obtained - Non-participating FI')
    `);

    // Create the nfe_category table
    await queryRunner.query(`
      CREATE TABLE bse_nfe_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_nfe_category
    await queryRunner.query(`
      INSERT INTO bse_nfe_category (code, description) VALUES
      ('L', 'Listed Entity'),
      ('RL', 'Related to Listed Entity'),
      ('A', 'Active NEFFE'),
      ('P', 'Passive NEFFE'),
      ('NA', 'Not Applicable for Non NFFE')
    `);

    // Create the bse_nfe_sub_category table
    await queryRunner.query(`
      CREATE TABLE bse_nfe_sub_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(2) NOT NULL,
        description TEXT NOT NULL
      )
    `);

    // Insert the data into bse_nfe_sub_category
    await queryRunner.query(`
      INSERT INTO bse_nfe_sub_category (code, description) VALUES
      ('01', "Less than 50 percent of the NFE's gross income for the preceding financial year is passive income and less than 50 percent of the assets held by the NFE during the preceding financial year are assets that produce or are held for the production of passive income"),
      ('02', 'The NFE is a Governmental Entity, an International Organization, a Central Bank, or an entity wholly owned by one or more of the foregoing'),
      ('03', 'Substantially all of the activities of the NFE consist of holding (in whole or in part) the outstanding stock of, or providing financing and services to, one or more subsidiaries that engage in trades or businesses other than the business of a Financial Institution'),
      ('04', 'The NFE is not yet operating a business and has no prior operating history, but is investing capital into assets with the intent to operate a business other than that of a Financial Institution'),
      ('05', 'The NFE was not a Financial Institution in the past five years, and is in the process of liquidating its assets or is reorganizing with the intent to continue or recommence operations in a business other than that of a Financial Institution'),
      ('06', 'The NFE primarily engages in financing and hedging transactions with, or for, Related Entities that are not Financial Institutions, and does not provide financing or hedging services to any Entity that is not a Related Entity'),
      ('07', 'Any NFE that fulfills all of the following requirements: It is established and operated in India exclusively for religious, charitable, scientific, artistic, cultural, athletic, or educational purposes')
    `);

    // Create the nature_of_relation table
    await queryRunner.query(`
      CREATE TABLE bse_nature_of_relation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_nature_of_relation
    await queryRunner.query(`
      INSERT INTO bse_nature_of_relation (code, description) VALUES
      ('SU', 'Subsidiary'),
      ('CO', 'Controlled')
    `);

    await queryRunner.query(`
      CREATE TABLE bse_ubo_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_ubo_category
    await queryRunner.query(`
      INSERT INTO bse_ubo_category (code, description) VALUES
      ('UBO', 'Ultimate Beneficial Owner'),
      ('SMO', 'Senior Managing Official')
    `);

    // Create the ubo_type_code table
    await queryRunner.query(`
      CREATE TABLE bse_ubo_type_code (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_ubo_type_code
    await queryRunner.query(`
      INSERT INTO bse_ubo_type_code (code, description) VALUES
      ('C01', 'CP of legal person-ownership'),
      ('C02', 'CP of legal person-other means'),
      ('C03', 'CP of legal person-senior managing official'),
      ('C04', 'CP of legal arrangement-trust-settlor'),
      ('C05', 'CP of legal arrangement-trust-trustee'),
      ('C06', 'CP of legal arrangement-trust-protector'),
      ('C07', 'CP of legal arrangement-trust-beneficiary'),
      ('C08', 'CP of legal arrangement-trust-other'),
      ('C09', 'CP of legal arrangement-trust-other-settlor equivalent'),
      ('C10', 'CP of legal arrangement-trust-other-trustee-equivalent'),
      ('C11', 'CP of legal arrangement-trust-other-protector equivalent'),
      ('C12', 'CP of legal arrangement-trust-other-beneficiary-equivalent'),
      ('C13', 'CP of legal arrangement-trust-other-other-equivalent'),
      ('C14', 'Unknown')
    `);

    // Create the order_phys_or_demat table
    await queryRunner.query(`
      CREATE TABLE bse_order_phys_or_demat (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_order_phys_or_demat
    await queryRunner.query(`
      INSERT INTO bse_order_phys_or_demat (code, description) VALUES
      ('P', 'Physical'),
      ('D', 'Demat')
    `);

    // Create the order_status table
    await queryRunner.query(`
      CREATE TABLE bse_order_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_order_status
    await queryRunner.query(`
      INSERT INTO bse_order_status (code, description) VALUES
      ('o', 'Open Orders'),
      ('c', 'Completed Orders'),
      ('a', 'All Orders')
    `);

    // Create the order_source table
    await queryRunner.query(`
      CREATE TABLE bse_order_source (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_order_source
    await queryRunner.query(`
      INSERT INTO bse_order_source (code, description) VALUES
      ('sip', 'Order source SIP'),
      ('stp', 'Order source STP'),
      ('swp', 'Order source SWP'),
      ('nfo', 'Order source NFO'),
      ('lumpsum', 'Order source Lumpsum'),
      ('combo', 'Order source is Combo order')
    `);

    // Create the order_list_status table
    await queryRunner.query(`
      CREATE TABLE bse_order_list_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(100) NOT NULL,
        description TEXT NOT NULL
      )
    `);

    // Insert the data into bse_order_list_status
    await queryRunner.query(`
      INSERT INTO bse_order_list_status (code, description) VALUES
      ('received', 'Order is Received'),
      ('threshold_approval_pending', 'Threshold Approval for Order is pending'),
      ('match_pending', 'Order Match is Pending'),
      ('expired', 'Order is Expired'),
      ('matched', 'Order has Matched'),
      ('queued_for_rta', 'Order is queued for RTA'),
      ('queued_for_dp', 'Order is queued for DP'),
      ('ucc_rejected', 'UCC rejected order'),
      ('platform_rejected', 'Platform rejected order'),
      ('rta_rejected', 'RTA rejected order'),
      ('ops_rejected', 'OPS team rejected order'),
      ('rta_error', 'RTA Error for the order'),
      ('done', 'Order Processed successfully')
    `);

    // Create the mandate_type table
    await queryRunner.query(`
      CREATE TABLE bse_mandate_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_mandate_type
    await queryRunner.query(`
      INSERT INTO bse_mandate_type (code, description) VALUES
      ('X', 'NACH'),
      ('N', 'Enach, e-mandate'),
      ('I', 'imandate'),
      ('U', 'UPI Autopay')
    `);

    // Create the ubo_addr_type table
    await queryRunner.query(`
      CREATE TABLE bse_ubo_addr_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_ubo_addr_type
    await queryRunner.query(`
      INSERT INTO bse_ubo_addr_type (code, description) VALUES
      ('1', 'Residential or Business'),
      ('2', 'Residential'),
      ('3', 'Business'),
      ('4', 'Registered Office'),
      ('5', 'Unspecified')
    `);

    // Create the ucc_status table
    await queryRunner.query(`
      CREATE TABLE bse_ucc_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_ucc_status
    await queryRunner.query(`
      INSERT INTO bse_ucc_status (code, description) VALUES
      ('ALL', 'All Records'),
      ('ACTIVE', 'Active UCC Records'),
      ('INACTIVE', 'Inactive UCC Records'),
      ('SUSPENDED', 'Suspended UCC Records'),
      ('PENDING_AUTH', 'UCC Records which are Pending UCC Authentication'),
      ('PENDING_VERIFICATION', 'UCC Records which are Pending Verification')
    `);

    // Create the order_type table
    await queryRunner.query(`
      CREATE TABLE bse_order_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code CHAR(1) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_order_type
    await queryRunner.query(`
      INSERT INTO bse_order_type (code, description) VALUES
      ('P', 'Purchase'),
      ('R', 'Redemption'),
      ('S', 'Switch')
    `);

    // Create the mandate_mode table
    await queryRunner.query(`
      CREATE TABLE bse_mandate_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_mandate_mode
    await queryRunner.query(`
      INSERT INTO bse_mandate_mode (code, description) VALUES
      ('ACH', 'ACH'),
      ('AD', 'Auto Debit')
    `);

    // // Create the sxp_freq table
    // await queryRunner.query(`
    //   CREATE TABLE bse_sxp_freq (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     code CHAR(1) NOT NULL,
    //     description VARCHAR(255) NOT NULL
    //   )
    // `);

    // // Insert the data into bse_sxp_freq
    // await queryRunner.query(`
    //   INSERT INTO bse_sxp_freq (code, description) VALUES
    //   ('m', 'Monthly'),
    //   ('w', 'Weekly'),
    //   ('d', 'Daily'),
    //   ('f', 'Fortnightly'),
    //   ('q', 'Quarterly'),
    //   ('h', 'Half yearly'),
    //   ('y', 'Yearly')
    // `);

    // Create the sxp_type table
    await queryRunner.query(`
      CREATE TABLE bse_sxp_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(5) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_sxp_type
    await queryRunner.query(`
      INSERT INTO bse_sxp_type (code, description) VALUES
      ('sip', 'SIP'),
      ('swp', 'SWP'),
      ('stp', 'STP'),
      ('xsip', 'X-SIP'),
      ('isip', 'I-SIP')
    `);

    // Create the sxp_status table
    await queryRunner.query(`
      CREATE TABLE bse_sxp_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        description TEXT NOT NULL
      )
    `);

    // Insert the data into bse_sxp_status
    await queryRunner.query(`
      INSERT INTO bse_sxp_status (code, description) VALUES
      ('reg', 'Sxp is registered by the member.'),
      ('active', 'Sxp is Active'),
      ('inactive', 'Sxp is yet to start as per schedule'),
      ('paused', 'When UCC has requested to pause SxP'),
      ('cancelled', 'When UCC has requested to terminate SxP'),
      ('mandate_unlink', 'When the mandate is removed from the SxP'),
      ('autocancelled', 'For SIP, When N consecutive payments (as per sub scheme master) have failed'),
      ('matured', 'Once all instalments are completed as per the schedule'),
      ('invalidated', 'As per business rules defined in masters, this SxP is no longer valid')
    `);

    // Create the paymt_mode table
    await queryRunner.query(`
      CREATE TABLE bse_paymt_mode (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_paymt_mode
    await queryRunner.query(`
      INSERT INTO bse_paymt_mode (code, description) VALUES
      ('NEFT', 'NEFT'),
      ('RTGS', 'RTGS'),
      ('CHEQUE', 'Cheque'),
      ('UPI', 'UPI'),
      ('DD', 'Direct Debit')
    `);

    // Create the investor_type table
    await queryRunner.query(`
      CREATE TABLE bse_investor_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        description VARCHAR(255) NOT NULL
      )
    `);

    // Insert the data into bse_investor_type
    await queryRunner.query(`
      INSERT INTO bse_investor_type (type, description) VALUES
      ('Individual', 'Individual'),
      ('Non-Individual', 'Non-Individual')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
