import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'bse_address_type' })
export class BseAddressType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_auth_mode' })
export class BseAuthMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_bank_acc_owner' })
export class BseBankAccOwner {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_bank_acc_type' })
export class BseBankAccType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_comm_mode' })
export class BseCommMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_contact_type' })
export class BseContactType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_corporate_service_sector' })
export class BseCorporateServiceSector {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_data_source' })
export class BseDataSource {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_depository_code' })
export class BseDepositoryCode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_exemption_code' })
export class BseExemptionCode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_ffi_drnfe' })
export class BseFFiDrnfe {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_gender' })
export class BseGender {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_holder_rank' })
export class BseHolderRank {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_holding_nature' })
export class BseHolderNature {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_identifier_type' })
export class BseIdentifierType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_income_slab' })
export class BseIncomeSlab {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_investor_type' })
export class BseInvestorType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_is_giin_avail' })
export class BseIsGiinAvail {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_kyc_type' })
export class BseKycType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_mandate_mode' })
export class BseMandateMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_mandate_type' })
export class BseMandateType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_nature_of_relation' })
export class BseNatureOfRelation {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_nfe_category' })
export class BseNfeCategory {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_nfe_sub_category' })
export class BseNfeSubCategory {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_nomination_auth_mode' })
export class BseNominationAuthMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_nomination_relation' })
export class BseNominationRelation {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_occ_code' })
export class BseOccCode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column()
  type: string;
}

@Entity({ name: 'bse_occ_type' })
export class BseOccType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_onboarding' })
export class BseOnboarding {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_order_list_status' })
export class BseOrderListStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_order_phys_or_demat' })
export class BseOrderPhysOrDemat {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_order_source' })
export class BseOrderSource {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_order_status' })
export class BseOrderStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_order_type' })
export class BseOrderType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_pan_exempt_category' })
export class BsePanExemptCategory {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_paymt_mode' })
export class BsePaymtMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_politically_exposed' })
export class BsePoliticallyExposed {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_rdmp_idcw_pay_mode' })
export class BseRdmpIdcwPayMode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_sxp_status' })
export class BseSxpStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_sxp_type' })
export class BseSxpType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_tax_status' })
export class BseTaxStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_ubo_addr_type' })
export class BseUboAddrType {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_ubo_category' })
export class BseUboCategory {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_ubo_type_code' })
export class BseUboTypeCode {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_ucc_status' })
export class BseUccStatus {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_wealth_source' })
export class BseWealthSource {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_whose_contact_number' })
export class BseWhoseContactNumber {
  @PrimaryColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

@Entity({ name: 'bse_state_and_codes' })
export class BseStateandCode {
  @PrimaryColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  code: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
