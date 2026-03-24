import { Inject, Injectable, Scope } from '@nestjs/common';
import { AddressType } from 'src/onboarding/entities/address_types.entity';
import { Country } from 'src/onboarding/entities/countries.entity';
import {
  BseAddressType,
  BseAuthMode,
  BseBankAccOwner,
  BseBankAccType,
  BseCommMode,
  BseContactType,
  BseCorporateServiceSector,
  BseDataSource,
  BseDepositoryCode,
  BseExemptionCode,
  BseFFiDrnfe,
  BseGender,
  BseHolderNature,
  BseHolderRank,
  BseIdentifierType,
  BseIncomeSlab,
  BseInvestorType,
  BseIsGiinAvail,
  BseKycType,
  BseMandateMode,
  BseMandateType,
  BseNatureOfRelation,
  BseNfeCategory,
  BseNfeSubCategory,
  BseNominationAuthMode,
  BseNominationRelation,
  BseOccCode,
  BseOccType,
  BseOnboarding,
  BseOrderListStatus,
  BseOrderPhysOrDemat,
  BseOrderSource,
  BseOrderStatus,
  BseOrderType,
  BsePanExemptCategory,
  BsePaymtMode,
  BsePoliticallyExposed,
  BseRdmpIdcwPayMode,
  BseSxpStatus,
  BseSxpType,
  BseTaxStatus,
  BseUboAddrType,
  BseUboCategory,
  BseUboTypeCode,
  BseUccStatus,
  BseWealthSource,
  BseWhoseContactNumber,
} from 'src/utils/bse/entity/bse.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST }) // here
export class BseAddressTypeRepository extends Repository<BseAddressType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseAddressType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseAuthModeRepository extends Repository<BseAuthMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseAuthMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseBankAccOwnerRepository extends Repository<BseBankAccOwner> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseBankAccOwner, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseBankAccTypeRepository extends Repository<BseBankAccType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseBankAccType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseCommModeRepository extends Repository<BseCommMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseCommMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseContactTypeRepository extends Repository<BseContactType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseContactType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseCorporateServiceSectorRepository extends Repository<BseCorporateServiceSector> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseCorporateServiceSector, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseDataSourceRepository extends Repository<BseDataSource> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseDataSource, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseDepositoryCodeRepository extends Repository<BseDepositoryCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseDepositoryCode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseExemptionCodeRepository extends Repository<BseExemptionCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseExemptionCode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseFFiDrnfeRepository extends Repository<BseFFiDrnfe> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseFFiDrnfe, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseGenderRepository extends Repository<BseGender> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseGender, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseHolderRankRepository extends Repository<BseHolderRank> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseHolderRank, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseHolderNatureRepository extends Repository<BseHolderNature> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseHolderNature, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseIdentifierTypeRepository extends Repository<BseIdentifierType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseIdentifierType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseIncomeSlabRepository extends Repository<BseIncomeSlab> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseIncomeSlab, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseInvestorTypeRepository extends Repository<BseInvestorType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseInvestorType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseIsGiinAvailRepository extends Repository<BseIsGiinAvail> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseIsGiinAvail, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseKycTypeRepository extends Repository<BseKycType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseKycType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseMandateModeRepository extends Repository<BseMandateMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseMandateMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseMandateTypeRepository extends Repository<BseMandateType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseMandateType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseNatureOfRelationRepository extends Repository<BseNatureOfRelation> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseNatureOfRelation, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseNfeCategoryRepository extends Repository<BseNfeCategory> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseNfeCategory, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseNfeSubCategoryRepository extends Repository<BseNfeSubCategory> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseNfeSubCategory, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseNominationAuthModeRepository extends Repository<BseNominationAuthMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseNominationAuthMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseNominationRelationRepository extends Repository<BseNominationRelation> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseNominationRelation, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOccCodeRepository extends Repository<BseOccCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOccCode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOccTypeRepository extends Repository<BseOccType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOccType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOnboardingRepository extends Repository<BseOnboarding> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOnboarding, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOrderListStatusRepository extends Repository<BseOrderListStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOrderListStatus, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOrderPhysOrDematRepository extends Repository<BseOrderPhysOrDemat> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOrderPhysOrDemat, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOrderSourceRepository extends Repository<BseOrderSource> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOrderSource, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOrderStatusRepository extends Repository<BseOrderStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOrderStatus, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseOrderTypeRepository extends Repository<BseOrderType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseOrderType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BsePanExemptCategoryRepository extends Repository<BsePanExemptCategory> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BsePanExemptCategory, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BsePaymtModeRepository extends Repository<BsePaymtMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BsePaymtMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BsePoliticallyExposedRepository extends Repository<BsePoliticallyExposed> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BsePoliticallyExposed, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseRdmpIdcwPayModeRepository extends Repository<BseRdmpIdcwPayMode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseRdmpIdcwPayMode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseSxpStatusRepository extends Repository<BseSxpStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseSxpStatus, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseSxpTypeRepository extends Repository<BseSxpType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseSxpType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseTaxStatusRepository extends Repository<BseTaxStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseTaxStatus, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseUboAddrTypeRepository extends Repository<BseUboAddrType> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseUboAddrType, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseUboCategoryRepository extends Repository<BseUboCategory> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseUboCategory, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseUboTypeCodeRepository extends Repository<BseUboTypeCode> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseUboTypeCode, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseUccStatusRepository extends Repository<BseUccStatus> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseUccStatus, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseWealthSourceRepository extends Repository<BseWealthSource> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseWealthSource, dataSource.createEntityManager());
  }
}

@Injectable({ scope: Scope.REQUEST }) // here
export class BseWhoseContactNumberRepository extends Repository<BseWhoseContactNumber> {
  constructor(@Inject('CONNECTION') dataSource) {
    super(BseWhoseContactNumber, dataSource.createEntityManager());
  }
}
