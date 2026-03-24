export class AddUccNewBseDto {
  ucc = ''; // Client Code (UCC)
  primaryHolderFirstName = ''; // Primary Holder First Name
  primaryHolderMiddleName?: string = ''; // Primary Holder Middle Name
  primaryHolderLastName?: string = ''; // Primary Holder Last Name
  taxStatus = ''; // Tax Status (Mandatory for Individual, NRI, and Minor clients)
  gender = ''; // Gender (Mandatory)
  primaryHolderDob = ''; // Primary Holder DOB (DD/MM/YYYY)
  occupationCode = ''; // Occupation Code
  holdingNature = ''; // Holding Nature (SI/JO/AS)
  // Second Holder Details
  secondHolderFirstName?: string = ''; // Second Holder First Name
  secondHolderMiddleName?: string = ''; // Second Holder Middle Name
  secondHolderLastName?: string = ''; // Second Holder Last Name
  // Third Holder Details
  thirdHolderFirstName?: string = ''; // Third Holder First Name
  thirdHolderMiddleName?: string = ''; // Third Holder Middle Name
  thirdHolderLastName?: string = ''; // Third Holder Last Name
  secondHolderDob?: string = ''; // Second Holder DOB (DD/MM/YYYY)
  thirdHolderDob?: string = ''; // Third Holder DOB (DD/MM/YYYY)
  // Guardian Details (if applicable)
  guardianFirstName?: string = ''; // Guardian First Name
  guardianMiddleName?: string = ''; // Guardian Middle Name
  guardianLastName?: string = ''; // Guardian Last Name
  guardianDob?: string = ''; // Guardian DOB (DD/MM/YYYY)
  // PAN Exemptions
  primaryHolderPanExempt?: string = ''; // Primary Holder PAN Exempt (Y/N)
  secondHolderPanExempt?: string = ''; // Second Holder PAN Exempt (Y/N)
  thirdHolderPanExempt?: string = ''; // Third Holder PAN Exempt (Y/N)
  guardianPanExempt?: string = ''; // Guardian PAN Exempt (Y/N)
  // PAN Exempt Categories
  primaryHolderPan?: string = ''; // Primary Holder PAN
  secondHolderPan?: string = ''; // Second Holder PAN
  thirdHolderPan?: string = ''; // Third Holder PAN
  guardianPan?: string = ''; // Guardian PAN (if applicable)
  // Additional mandatory fields based on conditions
  primaryHolderPanExemptCategory?: string = ''; // Primary Holder PAN Exempt Category (Varchar 1)
  secondHolderExemptCategory?: string = ''; // ConditionalMandatory if Second Holder PAN Exempt flag is Y
  // Third Holder Exempt Category (Conditional)
  thirdHolderExemptCategory?: string = ''; // Conditional: Mandatory if Third Holder PAN Exempt flag is Y
  // Guardian Exempt Category (Conditional)
  guardianExemptCategory?: string = ''; // Conditional: Mandatory if Guardian PAN Exempt flag is Y
  // Client Type
  clientType = ''; // Client Type (P/D)
  // PMS Flag
  pmsFlag?: string = ''; // PMS Flag (Y/N)
  // DP Details (Default DP, CDSL DPID, NSDL DPID, etc.)
  defaultDp = ''; // Default DP (CDSL/NSDL)
  cdsldpid?: string = ''; // CDSL DPID (Mandatory if Default DP is CDSL)
  cdsldpidCltid?: string = ''; // CDSL CLT ID (Mandatory if Default DP is CDSL)
  cmbpid?: string = '';
  nsdldpid?: string = ''; // NSDL DPID (Mandatory if Default DP is NSDL)
  nsdlcltid?: string = ''; // NSDL CLT ID (Mandatory if Default DP is NSDL)
  // Account Details
  accountType1?: string = ''; // Account Type 1 (Physical/Demat)
  accountNo1?: string = ''; // Account No 1
  micrNo1?: string = ''; // MICR No 1
  ifscCode1?: string = ''; // IFSC Code 1
  defaultBankFlag1?: string = ''; // Default Bank Flag for Account 1 (Y/N)
  accountType2?: string = ''; // Account Type 2 (Physical/Demat)
  accountNo2?: string = ''; // Account No 2
  micrNo2?: string = ''; // MICR No 2
  ifscCode2?: string = ''; // IFSC Code 2
  defaultBankFlag2?: string = ''; // Default Bank Flag for Account 2 (Y/N)
  accountType3?: string = ''; // Account Type 3 (Physical/Demat)
  accountNo3?: string = ''; // Account No 3
  micrNo3?: string = ''; // MICR No 3
  ifscCode3?: string = ''; // IFSC Code 3
  defaultBankFlag3?: string = ''; // Default Bank Flag for Account 3 (Y/N)
  accountType4?: string = ''; // Account Type 4 (Physical/Demat)
  accountNo4?: string = ''; // Account No 4
  micrNo4?: string = ''; // MICR No 4
  ifscCode4?: string = ''; // IFSC Code 4
  defaultBankFlag4?: string = ''; // Default Bank Flag for Account 4 (Y/N)
  accountType5?: string = ''; // Account Type 5 (Physical/Demat)
  accountNo5?: string = ''; // Account No 5
  micrNo5?: string = ''; // MICR No 5
  ifscCode5?: string = ''; // IFSC Code 5
  defaultBankFlag5?: string = ''; // Default Bank Flag for Account 5 (Y/N)
  // Cheque Name
  chequeName?: string = ''; // Cheque Name
  // Dividend Pay Mode
  divPayMode?: string = ''; // Dividend Pay Mode (01/02/03/04/05)
  // Address Details
  address1?: string = ''; // Address Line 1
  address2?: string = ''; // Address Line 2
  address3?: string = ''; // Address Line 3
  city?: string = ''; // City
  state?: string = ''; // State
  pincode?: string = ''; // Pincode
  country?: string = ''; // Country
  resiPhone?: string = ''; // Residential Phone
  resiFax?: string = ''; // Residential Fax
  officePhone?: string = ''; // Office Phone
  officeFax?: string = ''; // Office Fax
  email?: string = ''; // Email
  communicationMode?: string = ''; // Communication Mode (P/E/M)
  // Foreign Address Details (NRI Specific)
  foreignAddress1?: string = ''; // Foreign Address Line 1 (Mandatory for NRI)
  foreignAddress2?: string = ''; // Foreign Address Line 2
  foreignAddress3?: string = ''; // Foreign Address Line 3
  foreignAddressCity?: string = ''; // Foreign Address City (Mandatory for NRI)
  foreignAddressPincode?: string = ''; // Foreign Address Pincode (Mandatory for NRI)
  foreignAddressState?: string = ''; // Foreign Address State (Mandatory for NRI)
  foreignAddressCountry?: string = ''; // Foreign Address Country (Mandatory for NRI)
  foreignAddressResiPhone?: string = ''; // Foreign Address Residential Phone
  foreignAddressFax?: string = ''; // Foreign Address Fax
  foreignAddressOffPhone?: string = ''; // Foreign Address Office Phone
  foreignAddressOffFax?: string = ''; // Foreign Address Office Fax
  indianMobileNo?: string = ''; // Indian Mobile Number

  primaryHolderKycType?: string = ''; // Primary Holder KYC Type (K - KRA Compliant, C - CKYC Compliant, B - Biometric KYC, E - Aadhaar eKYC PAN)
  primaryHolderCkycNumber?: string = ''; // Primary Holder CKYC Number
  secondHolderKycType?: string = ''; // Second Holder KYC Type (K - KRA Compliant, C - CKYC Compliant, B - Biometric KYC, E - Aadhaar eKYC PAN)
  secondHolderCkycNumber?: string = ''; // Second Holder CKYC Number
  thirdHolderKycType?: string = ''; // Third Holder KYC Type (K - KRA Compliant, C - CKYC Compliant, B - Biometric KYC, E - Aadhaar eKYC PAN)
  thirdHolderCkycNumber?: string = ''; // Third Holder CKYC Number
  guardianKycType?: string = ''; // Guardian KYC Type (K - KRA Compliant, C - CKYC Compliant, B - Biometric KYC, E - Aadhaar eKYC PAN)
  guardianCkycNumber?: string = ''; // Guardian CKYC Number
  // KRA Exempt Reference Numbers
  primaryHolderKraExemptRefNo?: string = ''; // Primary Holder KRA Exempt Ref No.
  secondHolderKraExemptRefNo?: string = ''; // Second Holder KRA Exempt Ref No.
  thirdHolderKraExemptRefNo?: string = ''; // Third Holder KRA Exempt Ref No.
  guardianKraExemptRefNo?: string = ''; // Guardian KRA Exempt Ref No.
  // Additional Details
  aadhaarUpdated?: string = ''; // Aadhaar Updated (Y/N)
  mapinId?: string = ''; // Mapin ID
  // Paperless Flag and LEI Details
  paperlessFlag?: string = ''; // Paperless Flag (P - Paper, Z - Paperless)
  leiNo?: string = ''; // LEI Number
  leiValidity?: string = ''; // LEI Validity (Date)
  filler1MobileDeclarationFlag?: string = ''; // Mobile Declaration Flag (Mandatory if Mobile No. is provided)
  filler2EmailDeclarationFlag?: string = ''; // Email Declaration Flag (Mandatory if Email Id is provided)
  // Nomination Fields

  // Second Holder Email (Mandatory if UCC Holding Nature is either 'JO' or 'AS')
  secondHolderEmail?: string = ''; // Second Holder Email Id
  secondHolderEmailDeclarationFlag?: string = ''; // Second Holder Email Declaration (Mandatory if email provided)
  // Second Holder Mobile Number
  secondHolderMobileNo?: string = ''; // Second Holder Mobile Number (Mandatory if UCC Holding Nature is 'JO' or 'AS')
  // Second Holder Mobile Declaration Flag
  secondHolderMobileDeclarationFlag?: string = ''; // Mobile Declaration Flag for Second Holder
  // Third Holder Email
  thirdHolderEmail?: string = ''; // Third Holder Email Id (Mandatory if Third Holder available in UCC)
  // Third Holder Email Declaration Flag
  thirdHolderEmailDeclarationFlag?: string = ''; // Email Declaration Flag for Third Holder
  // Third Holder Mobile Number
  thirdHolderMobileNo?: string = ''; // Third Holder Mobile Number (Mandatory if Third Holder available in UCC)
  // Third Holder Mobile Declaration Flag
  thirdHolderMobileDeclarationFlag?: string = ''; // Mobile Declaration Flag for Third Holder
  guardianRelationship?: string = '';

  nominationOpt?: string = ''; // Nomination Opt (Y/N)
  nominationAuthMode?: string = ''; // Nomination Authentication Mode (W - Wet Signature, E - eSign, O - OTP authentication)

  // // Nominee 1 Details
  nominee1Name?: string = ''; // Nominee 1 Name
  nominee1Relationship?: string = ''; // Nominee 1 Relationship
  nominee1ApplicablePercentage?: string = ''; // Nominee 1 Applicable %
  nominee1MinorFlag?: string = ''; // Nominee 1 Minor Flag (Y/N)
  nominee1Dob?: string = ''; // Nominee 1 Date of Birth (DD/MM/YYYY)
  nominee1Guardian?: string = ''; // Nominee 1 Guardian

  // Nominee PAN and Guardian PAN for up to 3 nominees
  nomineeGuardianPan1?: string = ''; // Nominee 1 Guardian PAN

  nominee1IDType?: string = ''; // Nominee 1 ID Type
  nominee1IDNumber?: string = ''; // Nominee 1 ID Number
  nominee1Email?: string = ''; // Nominee 1 Email
  nominee1MobileNo?: string = ''; // Nominee 1 Mobile Number
  nominee1Address1?: string = ''; // Nominee 1 Address Line 1
  nominee1Address2?: string = ''; // Nominee 1 Address Line 2
  nominee1Address3?: string = ''; // Nominee 1 Address Line 3
  nominee1City?: string = ''; // Nominee 1 City
  nominee1Pincode?: string = ''; // Nominee 1 Pincode
  nominee1Country?: string = ''; // Nominee 1 Country

  // // Nominee 2 Details
  nominee2Name?: string = ''; // Nominee 2 Name
  nominee2Relationship?: string = ''; // Nominee 2 Relationship
  nominee2ApplicablePercentage?: string = ''; // Nominee 2 Applicable %
  nominee2MinorFlag?: string = ''; // Nominee 2 Minor Flag (Y/N)
  nominee2Dob?: string = ''; // Nominee 2 Date of Birth (DD/MM/YYYY)

  nominee2Guardian?: string = ''; // Nominee 2 Guardian
  nomineeGuardianPan2?: string = ''; // Nominee 2 Guardian PAN

  nominee2IDType?: string = ''; // Nominee 2 ID Type
  nominee2IDNumber?: string = ''; // Nominee 2 ID Number
  nominee2Email?: string = ''; // Nominee 2 Email
  nominee2MobileNo?: string = ''; // Nominee 2 Mobile Number
  nominee2Address1?: string = ''; // Nominee 2 Address Line 1
  nominee2Address2?: string = ''; // Nominee 2 Address Line 2
  nominee2Address3?: string = ''; // Nominee 2 Address Line 3
  nominee2City?: string = ''; // Nominee 2 City
  nominee2Pincode?: string = ''; // Nominee 2 Pincode
  nominee2Country?: string = ''; // Nominee 2 Country

  // Nominee 3 Details
  nominee3Name?: string = ''; // Nominee 3 Name
  nominee3Relationship?: string = ''; // Nominee 3 Relationship
  nominee3ApplicablePercentage?: string = ''; // Nominee 3 Applicable %
  nominee3MinorFlag?: string = ''; // Nominee 3 Minor Flag (Y/N)
  nominee3Dob?: string = ''; // Nominee 3 Date of Birth (DD/MM/YYYY)
  nominee3Guardian?: string = ''; // Nominee 3 Guardian
  nomineeGuardianPan3?: string = ''; // Nominee 3 Guardian PAN

  nominee3IDType?: string = ''; // Nominee 3 ID Type
  nominee3IDNumber?: string = ''; // Nominee 3 ID Number
  nominee3Email?: string = ''; // Nominee 3 Email
  nominee3MobileNo?: string = ''; // Nominee 3 Mobile Number
  nominee3Address1?: string = ''; // Nominee 3 Address Line 1
  nominee3Address2?: string = ''; // Nominee 3 Address Line 2
  nominee3Address3?: string = ''; // Nominee 3 Address Line 3
  nominee3City?: string = ''; // Nominee 3 City
  nominee3Pincode?: string = ''; // Nominee 3 Pincode
  nominee3Country?: string = ''; // Nominee 3 Country

  nominee_soa?: string = ''; // Nominee SOA (Y/N)

  filler1?: string = '';
  filler2?: string = '';
  filler3?: string = '';
  filler4?: string = '';
  filler5?: string = '';
  filler6?: string = '';
  filler7?: string = '';
  filler8?: string = '';
}
