import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { totalmem } from 'os';
import { Mandates } from 'src/mandates/entities/mandates.entity';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { MfPurchasePlanRepository } from 'src/repositories/mf_purchase_plan.repository';
import { MfRedemptionPlanRepository } from 'src/repositories/mf_redemption_plan.repository';
import { MfSwitchPlanRepository } from 'src/repositories/mf_switch_plan.repository';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { TransactionBasketsRepository } from 'src/repositories/transaction_baskets.repository';
import { MfSwitchPlan } from 'src/transaction_baskets/entities/mf_switch_plan.entity';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import { TransactionBaskets } from 'src/transaction_baskets/entities/transaction_baskets.entity';
import { MutualfundsService } from 'src/utils/mutualfunds/mutualfunds.service';
import { In, Repository } from 'typeorm';
@Injectable()
export class OrderStatusService {
  mf_base_url: string;
  constructor(
    // @InjectRepository(TransactionBaskets)
    // private readonly transactionBasketsRepository:Repository<TransactionBaskets>,
    // @InjectRepository(TransactionBasketItems)
    // private readonly transactionBasketItemsRepository:Repository<TransactionBasketItems>,
    // @InjectRepository(Purchase)
    // private readonly purchaseRepository: Repository<Purchase>,
    // @InjectRepository(SwitchFunds)
    // private readonly switchFundRepository: Repository<SwitchFunds>,
    // @InjectRepository(Redemption)
    // private readonly redemptionRepository: Repository<Redemption>,
    // @InjectRepository(Mandates)
    // private readonly mandateRepository: Repository<Mandates>,

    private readonly transactionBasketsRepository: TransactionBasketsRepository,
    private readonly transactionBasketItemsRepository: TransactionBasketItemsRepository,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly switchFundRepository: SwitchFundsRepository,
    private readonly redemptionRepository: RedemptionRepository,
    private readonly mandateRepository: MandatesRepository,
    private readonly mfPurchasePlanRepository: MfPurchasePlanRepository,
    private readonly mfRedemptionPlanRepository: MfRedemptionPlanRepository,
    private readonly mfSwitchPlanRepository: MfSwitchPlanRepository,
    private readonly mutualFundService: MutualfundsService,
  ) {
    const configService = new ConfigService();
    this.mf_base_url = configService.get('MF_BASE_URL');
  }

  async get_fund_details(isin: string) {
    try {
      const fundDetails: any = await this.mutualFundService.findFundsByIsins([
        isin,
      ]);
      console.log('FUND DETAILS', fundDetails);

      return {
        fund_name: fundDetails.data[0].schemeName,
        logo_url: this.mf_base_url + '/' + fundDetails.data[0].amcLogoUrl,
      };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_lumpsum(user_id, type = null, page = 1, limit = 10) {
    try {
      let purchases = [];
      let total = 0;
      const offset = (page - 1) * limit;
      if (!type) {
        [purchases, total] = await this.purchaseRepository.findAndCount({
          where: {
            user_id,
            state: In([
              'confirmed',
              'successful',
              'failed',
              'submitted',
              'pending',
              'cancelled',
              'reversed',
            ]),
          },
          skip: offset,
          take: limit,
          relations: ['user'],
        }); // Limit the number of records});
      } else {
        [purchases, total] = await this.purchaseRepository.findAndCount({
          where: { user_id, state: type },
          skip: offset,
          take: limit,
          relations: ['user'],
        });
      }

      if (purchases.length > 0) {
        const result = await Promise.all(
          purchases.map(async (purchase) => {
            const fund_detail = await this.get_fund_details(purchase.scheme);
            purchase['fund_name'] = fund_detail.fund_name;
            purchase['logo_url'] = fund_detail.logo_url;
            return purchase;
          }),
        );
        return {
          status: HttpStatus.OK,
          data: result,
          page,
          limit,
          total: total,
        };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total: total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async completed_lumpsum(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'lumpsum', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const purchases = await this.purchaseRepository.find({
          where: {
            transaction_basket_item_id: In(item_ids),
            state: 'successful',
          },
        });

        if (purchases.length > 0) {
          const result = await Promise.all(
            purchases.map(async (purchase) => {
              const fund_detail = await this.get_fund_details(purchase.scheme);
              purchase['fund_name'] = fund_detail.fund_name;
              purchase['logo_url'] = fund_detail.logo_url;
              return purchase;
            }),
          );

          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inprogress_lumpsum(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'lumpsum', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const purchases = await this.purchaseRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'confirmed' },
            { transaction_basket_item_id: In(item_ids), state: 'submitted' },
          ],
        });
        if (purchases.length > 0) {
          const result = await Promise.all(
            purchases.map(async (purchase) => {
              const fund_detail = await this.get_fund_details(purchase.scheme);
              purchase['fund_name'] = fund_detail.fund_name;
              purchase['logo_url'] = fund_detail.logo_url;
              return purchase;
            }),
          );
          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async failed_lumpsum(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'lumpsum', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const purchases = await this.purchaseRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'failed' },
            { transaction_basket_item_id: In(item_ids), state: 'cancelled' },
            { transaction_basket_item_id: In(item_ids), state: 'reversed' },
          ],
        });
        if (purchases.length > 0) {
          const result = await Promise.all(
            purchases.map(async (purchase) => {
              const fund_detail = await this.get_fund_details(purchase.scheme);
              purchase['fund_name'] = fund_detail.fund_name;
              purchase['logo_url'] = fund_detail.logo_url;
              return purchase;
            }),
          );
          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_switch(user_id, type, page = 1, limit = 10) {
    try {
      let switch_funds = [];
      let total = 0;
      const offset = (page - 1) * limit;
      if (!type) {
        [switch_funds, total] = await this.switchFundRepository.findAndCount({
          where: {
            user_id,
            state: In([
              'confirmed',
              'successful',
              'failed',
              'submitted',
              'pending',
              'cancelled',
              'reversed',
            ]),
          },
          skip: offset,
          take: limit,
          relations: ['user'],
        });
      } else {
        [switch_funds, total] = await this.switchFundRepository.findAndCount({
          where: { user_id, state: type },
          skip: offset,
          take: limit,
          relations: ['user'],
        });
      }

      if (switch_funds.length > 0) {
        const result = await Promise.all(
          switch_funds.map(async (switch_fund: SwitchFunds) => {
            let fund_detail = await this.get_fund_details(
              switch_fund.switch_out_scheme,
            );
            switch_fund['switch_out_fund_name'] = fund_detail.fund_name;
            switch_fund['switch_out_logo_url'] = fund_detail.logo_url;

            fund_detail = await this.get_fund_details(
              switch_fund.switch_in_scheme,
            );
            switch_fund['switch_in_fund_name'] = fund_detail.fund_name;
            switch_fund['switch_in_logo_url'] = fund_detail.logo_url;
            return switch_fund;
          }),
        );
        return { status: HttpStatus.OK, data: result, page, limit, total };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async completed_switches(user_id: number) {
    try {
      try {
        const transaction_basket_item_ids =
          await this.transactionBasketItemsRepository.find({
            select: { id: true },
            where: { transaction_type: 'switch_fund', user_id: user_id },
          });

        console.log(transaction_basket_item_ids);
        const item_ids = transaction_basket_item_ids.map((item) => {
          return item.id;
        });

        if (transaction_basket_item_ids.length > 0) {
          const switches = await this.switchFundRepository.find({
            where: {
              transaction_basket_item_id: In(item_ids),
              state: 'successful',
            },
          });
          if (switches.length > 0) {
            const result = await Promise.all(
              switches.map(async (switchfund) => {
                let fund_detail = await this.get_fund_details(
                  switchfund.switch_in_scheme,
                );
                switchfund['switch_in_fund_name'] = fund_detail.fund_name;
                switchfund['switch_in_fund_logo_url'] = fund_detail.logo_url;

                fund_detail = await this.get_fund_details(
                  switchfund.switch_out_scheme,
                );
                switchfund['switch_out_fund_name'] = fund_detail.fund_name;
                switchfund['switch_out_fund_logo_url'] = fund_detail.logo_url;

                return switchfund;
              }),
            );
            return { status: HttpStatus.OK, data: result };
          } else {
            return { status: HttpStatus.OK, data: [] };
          }
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } catch (err) {
        return { status: HttpStatus.BAD_REQUEST, error: err.message };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inprogress_switches(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'switch_fund', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const switches = await this.switchFundRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'pending' },
            { transaction_basket_item_id: In(item_ids), state: 'confirmed' },
            { transaction_basket_item_id: In(item_ids), state: 'submitted' },
          ],
        });
        if (switches.length > 0) {
          const result = await Promise.all(
            switches.map(async (switchfund) => {
              let fund_detail = await this.get_fund_details(
                switchfund.switch_in_scheme,
              );
              switchfund['switch_in_fund_name'] = fund_detail.fund_name;
              switchfund['switch_in_fund_logo_url'] = fund_detail.logo_url;

              fund_detail = await this.get_fund_details(
                switchfund.switch_out_scheme,
              );
              switchfund['switch_out_fund_name'] = fund_detail.fund_name;
              switchfund['switch_out_fund_logo_url'] = fund_detail.logo_url;

              return switchfund;
            }),
          );

          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async failed_switches(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'switch_fund', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const switches = await this.switchFundRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'failed' },
            { transaction_basket_item_id: In(item_ids), state: 'cancelled' },
            { transaction_basket_item_id: In(item_ids), state: 'reversed' },
          ],
        });
        if (switches.length > 0) {
          const result = await Promise.all(
            switches.map(async (switchfund) => {
              let fund_detail = await this.get_fund_details(
                switchfund.switch_in_scheme,
              );
              switchfund['switch_in_fund_name'] = fund_detail.fund_name;
              switchfund['switch_in_fund_logo_url'] = fund_detail.logo_url;

              fund_detail = await this.get_fund_details(
                switchfund.switch_out_scheme,
              );
              switchfund['switch_out_fund_name'] = fund_detail.fund_name;
              switchfund['switch_out_fund_logo_url'] = fund_detail.logo_url;

              return switchfund;
            }),
          );

          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_redemptions(user_id, type, page = 1, limit = 10) {
    try {
      let redemption_funds = [];
      const offset = (page - 1) * limit;
      let total = 0;
      if (!type) {
        [redemption_funds, total] =
          await this.redemptionRepository.findAndCount({
            where: {
              user_id,
              state: In([
                'confirmed',
                'successful',
                'failed',
                'submitted',
                'pending',
                'cancelled',
                'reversed',
              ]),
            },
            skip: offset,
            take: limit,
            relations: ['user'],
          });
      } else {
        [redemption_funds, total] =
          await this.redemptionRepository.findAndCount({
            where: { user_id, state: type },
            skip: offset,
            take: limit,
            relations: ['user'],
          });
      }

      if (redemption_funds.length > 0) {
        const result = await Promise.all(
          redemption_funds.map(async (redemption: Redemption) => {
            const fund_detail = await this.get_fund_details(redemption.scheme);
            redemption['switch_out_fund_name'] = fund_detail.fund_name;
            redemption['switch_out_logo_url'] = fund_detail.logo_url;

            return redemption;
          }),
        );
        return { status: HttpStatus.OK, data: result, page, limit, total };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async completed_redemption(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'redemption', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const redemptions = await this.redemptionRepository.find({
          where: {
            transaction_basket_item_id: In(item_ids),
            state: 'successful',
          },
        });
        if (redemptions.length > 0) {
          const result = await Promise.all(
            redemptions.map(async (redemption) => {
              const fund_detail = await this.get_fund_details(
                redemption.scheme,
              );
              redemption['fund_name'] = fund_detail.fund_name;
              redemption['logo_url'] = fund_detail.logo_url;
              return redemption;
            }),
          );

          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inprogress_redemption(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'redemption', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const redemptions = await this.redemptionRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'pending' },
            { transaction_basket_item_id: In(item_ids), state: 'confirmed' },
            { transaction_basket_item_id: In(item_ids), state: 'submitted' },
          ],
        });
        if (redemptions.length > 0) {
          const result = await Promise.all(
            redemptions.map(async (redemption) => {
              const fund_detail = await this.get_fund_details(
                redemption.scheme,
              );
              redemption['fund_name'] = fund_detail.fund_name;
              redemption['logo_url'] = fund_detail.logo_url;
              return redemption;
            }),
          );
          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async failed_redemption(user_id: number) {
    try {
      const transaction_basket_item_ids =
        await this.transactionBasketItemsRepository.find({
          select: { id: true },
          where: { transaction_type: 'redemption', user_id: user_id },
        });

      console.log(transaction_basket_item_ids);
      const item_ids = transaction_basket_item_ids.map((item) => {
        return item.id;
      });

      if (transaction_basket_item_ids.length > 0) {
        const redemptions = await this.redemptionRepository.find({
          where: [
            { transaction_basket_item_id: In(item_ids), state: 'failed' },
            { transaction_basket_item_id: In(item_ids), state: 'cancelled' },
            { transaction_basket_item_id: In(item_ids), state: 'reversed' },
          ],
        });
        if (redemptions.length > 0) {
          const result = await Promise.all(
            redemptions.map(async (redemption) => {
              const fund_detail = await this.get_fund_details(
                redemption.scheme,
              );
              redemption['fund_name'] = fund_detail.fund_name;
              redemption['logo_url'] = fund_detail.logo_url;
              return redemption;
            }),
          );
          return { status: HttpStatus.OK, data: result };
        } else {
          return { status: HttpStatus.OK, data: [] };
        }
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_sip(user_id, type, page = 1, limit = 10) {
    try {
      let mf_purchase_plans = [];
      let total = 0;
      const offset = (page - 1) * limit;
      if (!type) {
        [mf_purchase_plans, total] =
          await this.mfPurchasePlanRepository.findAndCount({
            where: {
              user_id,
              state: In([
                'created',
                'active',
                'cancelled',
                'completed',
                'failed',
              ]),
            },
            relations: ['purchases', 'user'],
            skip: offset,
            take: limit,
          });
      } else {
        [mf_purchase_plans, total] =
          await this.mfPurchasePlanRepository.findAndCount({
            where: { user_id, state: type },
            relations: ['purchases', 'user'],
            skip: offset,
            take: limit,
          });
      }

      if (mf_purchase_plans.length > 0) {
        const result = await Promise.all(
          mf_purchase_plans.map(async (purchase_plan) => {
            const fund_detail = await this.get_fund_details(
              purchase_plan.scheme,
            );
            purchase_plan['fund_name'] = fund_detail.fund_name;
            purchase_plan['logo_url'] = fund_detail.logo_url;
            return purchase_plan;
          }),
        );
        return { status: HttpStatus.OK, data: result, page, limit, total };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async active_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'sip',
            user_id: user_id,
            status: 'active',
          },
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async pending_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'sip',
            user_id: user_id,
            status: 'created',
          },
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inactive_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: [
            { transaction_type: 'sip', user_id: user_id, status: 'cancelled' },
            { transaction_type: 'sip', user_id: user_id, status: 'failed' },
            { transaction_type: 'sip', user_id: user_id, status: 'completed' },
          ],
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );
        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async active_smart_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
            transaction_basket_id: true,
          },
          where: {
            transaction_type: 'smart_sip',
            user_id: user_id,
            status: 'active',
          },
        });

      const ids = transaction_basket_items.map((item) => {
        return item.transaction_basket_id;
      });

      const transaction_baskets = await this.transactionBasketsRepository.find({
        where: { id: In(ids) },
        relations: ['transaction_basket_items'],
      });

      const result_basket = [];

      for (const basket of transaction_baskets) {
        if (basket.transaction_basket_items.length > 0) {
          const result = await Promise.all(
            basket.transaction_basket_items.map(async (transaction) => {
              const fund_detail = await this.get_fund_details(
                transaction.fund_isin,
              );
              transaction['fund_name'] = fund_detail.fund_name;
              transaction['logo_url'] = fund_detail.logo_url;
              return transaction;
            }),
          );

          basket.transaction_basket_items = result;
          result_basket.push(basket);
        }
      }

      return { status: HttpStatus.OK, data: result_basket };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async pending_smart_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
            transaction_basket_id: true,
          },
          where: {
            transaction_type: 'sip',
            user_id: user_id,
            status: 'created',
          },
        });

      const ids = transaction_basket_items.map((item) => {
        return item.transaction_basket_id;
      });

      const transaction_baskets = await this.transactionBasketsRepository.find({
        where: { id: In(ids) },
        relations: ['transaction_basket_items'],
      });

      const result_basket = [];

      for (const basket of transaction_baskets) {
        if (basket.transaction_basket_items.length > 0) {
          const result = await Promise.all(
            basket.transaction_basket_items.map(async (transaction) => {
              const fund_detail = await this.get_fund_details(
                transaction.fund_isin,
              );
              transaction['fund_name'] = fund_detail.fund_name;
              transaction['logo_url'] = fund_detail.logo_url;
              return transaction;
            }),
          );

          basket.transaction_basket_items = result;
          result_basket.push(basket);
        }
      }

      return { status: HttpStatus.OK, data: result_basket };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inactive_smart_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
            transaction_basket_id: true,
          },
          where: [
            { transaction_type: 'sip', user_id: user_id, status: 'cancelled' },
            { transaction_type: 'sip', user_id: user_id, status: 'failed' },
            { transaction_type: 'sip', user_id: user_id, status: 'completed' },
          ],
        });

      const ids = transaction_basket_items.map((item) => {
        return item.transaction_basket_id;
      });

      const transaction_baskets = await this.transactionBasketsRepository.find({
        where: { id: In(ids) },
        relations: ['transaction_basket_items'],
      });

      const result_basket = [];

      for (const basket of transaction_baskets) {
        if (basket.transaction_basket_items.length > 0) {
          const result = await Promise.all(
            basket.transaction_basket_items.map(async (transaction) => {
              const fund_detail = await this.get_fund_details(
                transaction.fund_isin,
              );
              transaction['fund_name'] = fund_detail.fund_name;
              transaction['logo_url'] = fund_detail.logo_url;
              return transaction;
            }),
          );

          basket.transaction_basket_items = result;
          result_basket.push(basket);
        }
      }

      return { status: HttpStatus.OK, data: result_basket };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async active_no_mandate_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'no_mandate_sip',
            user_id: user_id,
            status: 'active',
          },
          relations: ['purchases'],
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inactive_no_mandate_sips(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: [
            {
              transaction_type: 'no_mandate_sip',
              user_id: user_id,
              status: 'cancelled',
            },
            {
              transaction_type: 'no_mandate_sip',
              user_id: user_id,
              status: 'completed',
            },
          ],
          relations: ['purchases'],
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );
        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_swp(user_id, type, page = 1, limit = 10) {
    try {
      let mf_redemption_plans = [];
      let total = 0;
      const offset = (page - 1) * limit;
      if (!type) {
        [mf_redemption_plans, total] =
          await this.mfRedemptionPlanRepository.findAndCount({
            where: {
              user_id,
              state: In([
                'created',
                'active',
                'cancelled',
                'completed',
                'failed',
              ]),
            },
            relations: ['redemptions', 'user'],
            skip: offset,
            take: limit,
          });
      } else {
        [mf_redemption_plans, total] =
          await this.mfRedemptionPlanRepository.findAndCount({
            where: { user_id, state: type },
            relations: ['redemptions', 'user'],
            skip: offset,
            take: limit,
          });
      }

      if (mf_redemption_plans.length > 0) {
        const result = await Promise.all(
          mf_redemption_plans.map(async (redemption_plan) => {
            const fund_detail = await this.get_fund_details(
              redemption_plan.scheme,
            );
            redemption_plan['fund_name'] = fund_detail.fund_name;
            redemption_plan['logo_url'] = fund_detail.logo_url;
            return redemption_plan;
          }),
        );
        return { status: HttpStatus.OK, data: result, page, limit, total };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async active_swps(user_id: number) {
    try {
      let fund_detail;
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_swp_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'swp',
            user_id: user_id,
            status: 'active',
          },
        });
      console.log('items', transaction_basket_items);
      console.log('items', transaction_basket_items.length);
      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            fund_detail = await this.get_fund_details(transaction.fund_isin);
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );
        console.log('fund', fund_detail);
        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async pending_swps(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_swp_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'swp',
            user_id: user_id,
            status: 'created',
          },
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );
        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inactive_swps(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_swp_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: [
            { transaction_type: 'swp', user_id: user_id, status: 'cancelled' },
            { transaction_type: 'swp', user_id: user_id, status: 'failed' },
            { transaction_type: 'swp', user_id: user_id, status: 'completed' },
          ],
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            const fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;
            return transaction;
          }),
        );
        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async all_stp(user_id, type, page = 1, limit = 10) {
    try {
      let mf_switch_plans = [];
      let total = 0;
      const offset = (page - 1) * limit;
      if (!type) {
        [mf_switch_plans, total] =
          await this.mfSwitchPlanRepository.findAndCount({
            where: {
              user_id,
              state: In([
                'created',
                'active',
                'cancelled',
                'completed',
                'failed',
              ]),
            },
            relations: ['switch_funds', 'user'],
            skip: offset,
            take: limit,
          });
      } else {
        [mf_switch_plans, total] =
          await this.mfSwitchPlanRepository.findAndCount({
            where: { user_id, state: type },
            relations: ['switch_funds', 'user'],
            skip: offset,
            take: limit,
          });
      }

      if (mf_switch_plans.length > 0) {
        const result = await Promise.all(
          mf_switch_plans.map(async (swtich_plan: MfSwitchPlan) => {
            let fund_detail = await this.get_fund_details(
              swtich_plan.switch_in_scheme,
            );
            swtich_plan['switch_in_fund_name'] = fund_detail.fund_name;
            swtich_plan['switch_in_logo_url'] = fund_detail.logo_url;

            fund_detail = await this.get_fund_details(
              swtich_plan.switch_out_scheme,
            );
            swtich_plan['switch_out_fund_name'] = fund_detail.fund_name;
            swtich_plan['switch_out_logo_url'] = fund_detail.logo_url;
            return swtich_plan;
          }),
        );
        return { status: HttpStatus.OK, data: result, page, limit, total };
      } else {
        return { status: HttpStatus.OK, data: [], page, limit, total };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async active_stps(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_stp_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'stp',
            user_id: user_id,
            status: 'active',
          },
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            let fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;

            fund_detail = await this.get_fund_details(transaction.to_fund_isin);
            transaction['to_fund_name'] = fund_detail.fund_name;
            transaction['to_fund_logo_url'] = fund_detail.logo_url;

            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async pending_stps(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_stp_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: {
            transaction_type: 'stp',
            user_id: user_id,
            status: 'created',
          },
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            let fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;

            fund_detail = await this.get_fund_details(transaction.to_fund_isin);
            transaction['to_fund_name'] = fund_detail.fund_name;
            transaction['to_fund_logo_url'] = fund_detail.logo_url;

            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async inactive_stps(user_id: number) {
    try {
      const transaction_basket_items =
        await this.transactionBasketItemsRepository.find({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_stp_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: [
            { transaction_type: 'stp', user_id: user_id, status: 'cancelled' },
            { transaction_type: 'stp', user_id: user_id, status: 'failed' },
            { transaction_type: 'stp', user_id: user_id, status: 'completed' },
          ],
        });

      if (transaction_basket_items.length > 0) {
        const result = await Promise.all(
          transaction_basket_items.map(async (transaction) => {
            let fund_detail = await this.get_fund_details(
              transaction.fund_isin,
            );
            transaction['fund_name'] = fund_detail.fund_name;
            transaction['logo_url'] = fund_detail.logo_url;

            fund_detail = await this.get_fund_details(transaction.to_fund_isin);
            transaction['to_fund_name'] = fund_detail.fund_name;
            transaction['to_fund_logo_url'] = fund_detail.logo_url;

            return transaction;
          }),
        );

        return { status: HttpStatus.OK, data: result };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_smart_sip_details(fp_sip_id: string) {
    try {
      const transaction_basket_item =
        await this.transactionBasketItemsRepository.findOne({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
            payment_source: true,
          },
          where: { fp_sip_id: fp_sip_id },
        });

      if (transaction_basket_item) {
        const fund_detail = await this.get_fund_details(
          transaction_basket_item.fund_isin,
        );
        transaction_basket_item['fund_name'] = fund_detail.fund_name;
        transaction_basket_item['logo_url'] = fund_detail.logo_url;
        console.log('transaction_basket_item - ', transaction_basket_item);

        console.log(
          'MANDATE NUMBER - ',
          Number(transaction_basket_item.payment_source),
        );
        transaction_basket_item['mandate'] =
          await this.mandateRepository.findOne({
            where: { mandate_id: transaction_basket_item.payment_source },
          });

        transaction_basket_item['installments'] =
          await this.purchaseRepository.find({
            where: { plan: fp_sip_id },
          });

        return { status: HttpStatus.OK, data: transaction_basket_item };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_sip_details(fp_sip_id: string) {
    try {
      const transaction_basket_item =
        await this.transactionBasketItemsRepository.findOne({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
            payment_method: true,
            created_at: true,
            start_date: true,
            end_date: true,
          },
          where: { fp_sip_id: fp_sip_id },
        });

      if (transaction_basket_item) {
        const fund_detail = await this.get_fund_details(
          transaction_basket_item.fund_isin,
        );
        transaction_basket_item['fund_name'] = fund_detail.fund_name;
        transaction_basket_item['logo_url'] = fund_detail.logo_url;
        console.log('transaction_basket_item - ', transaction_basket_item);

        console.log(
          'MANDATE NUMBER - ',
          Number(transaction_basket_item.payment_source),
        );
        transaction_basket_item['mandate'] =
          await this.mandateRepository.findOne({
            where: { mandate_id: transaction_basket_item.payment_source },
            relations: ['user_bank_detail'],
          });

        transaction_basket_item['installments'] =
          await this.purchaseRepository.find({
            where: { plan: fp_sip_id },
          });
        transaction_basket_item['bank_name'] =
          transaction_basket_item['mandate'].user_bank_detail.bank_name;

        return { status: HttpStatus.OK, data: transaction_basket_item };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_no_mandate_sip_details(id: number) {
    try {
      const transaction_basket_item =
        await this.transactionBasketItemsRepository.findOne({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_sip_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: { id: id },
        });

      if (transaction_basket_item) {
        const fund_detail = await this.get_fund_details(
          transaction_basket_item.fund_isin,
        );
        transaction_basket_item['fund_name'] = fund_detail.fund_name;
        transaction_basket_item['logo_url'] = fund_detail.logo_url;

        transaction_basket_item['installments'] =
          await this.purchaseRepository.find({
            where: { transaction_basket_item_id: id },
          });

        return { status: HttpStatus.OK, data: transaction_basket_item };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_swp_details(fp_swp_id: string) {
    try {
      const transaction_basket_item =
        await this.transactionBasketItemsRepository.findOne({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_swp_id: true,
            fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: { fp_swp_id: fp_swp_id },
        });

      if (transaction_basket_item) {
        const fund_detail = await this.get_fund_details(
          transaction_basket_item.fund_isin,
        );
        transaction_basket_item['fund_name'] = fund_detail.fund_name;
        transaction_basket_item['logo_url'] = fund_detail.logo_url;

        transaction_basket_item['installments'] =
          await this.redemptionRepository.find({
            where: { plan: fp_swp_id },
          });

        return { status: HttpStatus.OK, data: transaction_basket_item };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_stp_details(fp_stp_id: string) {
    try {
      const transaction_basket_item =
        await this.transactionBasketItemsRepository.findOne({
          select: {
            id: true,
            frequency: true,
            installment_day: true,
            number_of_installments: true,
            folio_number: true,
            user_id: true,
            fp_stp_id: true,
            fund_isin: true,
            to_fund_isin: true,
            units: true,
            amount: true,
            status: true,
          },
          where: { fp_stp_id: fp_stp_id },
        });

      if (transaction_basket_item) {
        let fund_detail = await this.get_fund_details(
          transaction_basket_item.fund_isin,
        );
        transaction_basket_item['fund_name'] = fund_detail.fund_name;
        transaction_basket_item['logo_url'] = fund_detail.logo_url;

        fund_detail = await this.get_fund_details(
          transaction_basket_item.to_fund_isin,
        );
        transaction_basket_item['to_fund_name'] = fund_detail.fund_name;
        transaction_basket_item['to_fund_logo_url'] = fund_detail.logo_url;

        transaction_basket_item['installments'] =
          await this.switchFundRepository.find({
            where: { plan: fp_stp_id },
          });

        return { status: HttpStatus.OK, data: transaction_basket_item };
      } else {
        return { status: HttpStatus.OK, data: [] };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
