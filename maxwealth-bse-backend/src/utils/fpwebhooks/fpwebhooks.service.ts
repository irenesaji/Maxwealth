import { HttpStatus, Injectable } from '@nestjs/common';
import { FintechService } from '../fintech/fintech.service';
import { Purchase } from 'src/transaction_baskets/entities/purchases.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { TransactionBasketItems } from 'src/transaction_baskets/entities/transaction_basket_items.entity';
import msg91 from 'msg91';
import { Users } from 'src/users/entities/users.entity';
// import { Msg91Service } from '../msg91/msg91.service';
import { Redemption } from 'src/transaction_baskets/entities/redemptions.entity';
import { SwitchFunds } from 'src/transaction_baskets/entities/switch_funds.entity';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { Mandates } from 'src/mandates/entities/mandates.entity';
import { PurchaseRepository } from 'src/repositories/purchase.repository';
import { TransactionBasketItemsRepository } from 'src/repositories/transaction_basket_item.repository';
import { UsersRepository } from 'src/repositories/user.repository';
import { RedemptionRepository } from 'src/repositories/redemption.repository';
import { SwitchFundsRepository } from 'src/repositories/switch_fund.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import { MandatesRepository } from 'src/repositories/mandates.repository';
import { EnablexService } from '../enablex/enablex.service';

@Injectable()
export class FpwebhooksService {
  events = [
    'kyc_request.successful',
    'kyc_request.rejected',
    'kyc_request.submitted',
    'kyc_request.esign_required',
    'mf_purchase.created',
    'mf_purchase.confirmed',
    'mf_purchase.submitted',
    'mf_purchase.successful',
    'mf_purchase.failed',
    'mf_purchase.cancelled',
    'mf_purchase.reversed',
    'mf_redemption.created',
    'mf_redemption.confirmed',
    'mf_redemption.submitted',
    'mf_redemption.successful',
    'mf_redemption.failed',
    'mf_redemption.cancelled',
    'mf_redemption.reversed',
    'mf_switch.created',
    'mf_switch.confirmed',
    'mf_switch.submitted',
    'mf_switch.successful',
    'mf_switch.failed',
    'mf_switch.cancelled',
    'mf_switch.reversed',
    'mandate.created',
    'mandate.received',
    'mandate.submitted',
    'mandate.approved',
    'mandate.rejected',
    'mandate.cancelled',
    'payment.pending',
    'payment.success',
    'payment.failed',
    'payment.submitted',
    'payment.initiated',
    'payment.approved',
    'payment.rejected',
    'mf_purchase_plan.created',
    'mf_purchase_plan.activated',
    'mf_purchase_plan.cancelled',
    'mf_purchase_plan.failed',
    'mf_purchase_plan.completed',
    'mf_redemption_plan.created',
    'mf_redemption_plan.activated',
    'mf_redemption_plan.cancelled',
    'mf_redemption_plan.failed',
    'mf_redemption_plan.completed',
    'mf_switch_plan.created',
    'mf_switch_plan.activated',
    'mf_switch_plan.cancelled',
    'mf_switch_plan.failed',
    'mf_switch_plan.completed',
  ];

  message_templates = {
    'kyc_request.successful': {
      email: '',
      sms: '',
      whatsapp: '',
    },
    'mf_purchase.successful': {
      email: 'mutualfundpurchaseconfirmation',
      sms: '651c0c0fd6fc050a643f21c2',
      whatsapp: 'mutual_fund_purchase_confirmation',
    },
  };

  message_template_variables = {
    'kyc_request.successful': {
      email: {},
      sms: {},
      whatsapp: {},
    },
    'mf_purchase.successful': {
      email: {
        Transaction_Reference_Number: null,
        Mutual_Fund_Name: null,
        Purchase_Amount: null,
        Transaction_Date: null,
      },
      sms: {
        ApplicationReferenceNumber: null,
        InvestmentAmount: null,
        InvestmentDate: null,
        MutualFundName: null,
      },
      whatsapp: [
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
      ],
    },
    'mf_redemption.successful': {
      email: {
        Transaction_Reference_Number: null,
        Mutual_Fund_Name: null,
        Redemption_Amount: null,
        Transaction_Date: null,
      },
      sms: {
        TransactionReferenceNumber: null,
        RedemptionAmount: null,
        TransactionDate: null,
        MutualFundName: null,
      },
      whatsapp: [
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
      ],
    },
    'mf_switch.successful': {
      email: {
        Transaction_Reference_Number: null,
        Source_Mutual_Fund_Name: null,
        Destination_Mutual_Fund_Name: null,
        Switched_Amount: null,
        Transaction_Date: null,
      },
      sms: {
        TransactionReferenceNumber: null,
        SwitchedAmount: null,
        TransactionDate: null,
        SourceMutualFundName: null,
        DestinationMutualFundName: null,
      },
      whatsapp: [
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
        { type: 'text', text: null },
      ],
    },
  };

  constructor(
    private readonly fintechService: FintechService,
    // private readonly msg91Service: Msg91Service,
    private readonly enablexService: EnablexService,

    // @InjectRepository(Purchase)
    // private purchaseRepository: Repository<Purchase> ,
    // @InjectRepository(TransactionBasketItems)
    // private transactionBasketItemsRepository: Repository<TransactionBasketItems> ,
    // @InjectRepository(Users)
    // private userRepository: Repository<Users> ,
    // @InjectRepository(Redemption)
    // private redemptionRepository: Repository<Redemption> ,
    // @InjectRepository(SwitchFunds)
    // private switchFundsRepository: Repository<SwitchFunds>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository: Repository<UserOnboardingDetails>,
    // @InjectRepository(Mandates)
    // private mandatesRepository: Repository<Mandates>,

    private purchaseRepository: PurchaseRepository,
    private transactionBasketItemsRepository: TransactionBasketItemsRepository,
    private userRepository: UsersRepository,
    private redemptionRepository: RedemptionRepository,
    private switchFundsRepository: SwitchFundsRepository,
    private userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private mandatesRepository: MandatesRepository,
  ) {}

  async subscribe_to_webhooks() {
    try {
      const response = await this.fintechService.fp_webhook_subscribe();
      if (response.status == HttpStatus.OK) {
        return { status: HttpStatus.OK, data: response.data };
      }
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: error.message };
    }
  }

  async get_all_webhooks() {
    try {
      // let response = await this.fintechService.fp_get_webhook_subscription();
      // if(response.status == HttpStatus.OK){
      //     return {status: HttpStatus.OK,data: response.data};
      // }
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: error.message };
    }
  }

  async notification(body: any) {
    try {
      console.log('inside notification', body);
      if (
        body.type == 'mf_purchase.submitted' ||
        body.type == 'mf_purchase.successful' ||
        body.type == 'mf_purchase.failed' ||
        body.type == 'mf_purchase.cancelled' ||
        body.type == 'mf_purchase.reversed' ||
        body.type == 'mf_purchase.confirmed' ||
        body.type == 'mf_purchase.created'
      ) {
        const response = await this.update_purchase_object(body.data.object);
        console.log('update db response', response);
        if (response.status == HttpStatus.OK) {
          const user = await this.userRepository.findOne({
            where: { id: response.data.user_id },
          });
          const sms = msg91.getSMS();

          if (body.type == 'mf_purchase.successful') {
            const sms_template_variables =
              this.message_template_variables[body.type].sms;
            sms_template_variables.ApplicationReferenceNumber =
              response.data.old_id;
            sms_template_variables.InvestmentAmount =
              response.data.transaction_basket_item.amount;

            const date = new Date(response.data.created_at);

            const day = date.getDate().toString().padStart(2, '0'); // Get the day and ensure it has two digits
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (note: months are zero-based) and ensure it has two digits
            const year = date.getFullYear().toString(); // Get the year

            const formattedDate = `${day}-${month}-${year}`;

            sms_template_variables.InvestmentDate = formattedDate;
            sms_template_variables.MutualFundName =
              response.data.transaction_basket_item.fund_isin;

            console.log(
              'template id',
              this.message_templates['mf_purchase.successful'].sms,
            );
            console.log('sms options', {
              mobile: '+91' + user.mobile,
              ...sms_template_variables,
            });
            console.log('sms');
            const send = await this.enablexService.hasEnablexSMS();
            if (send) {
              // let data = await this.enablexService.findOne("enablex")
              // console.log("hi", data.keys_json.from)
              // let info = {
              //     "var1": ""
              // }
              // this.enablexService.sendSMS(user.mobile, data.keys_json.from, data.keys_json.campaign_id.otp, data.keys_json.type, data.keys_json.template_id.otp, info)
            } else {
              const smsresp = sms.send(
                this.message_templates['mf_purchase.successful'].sms,
                { mobile: '+91' + user.mobile, ...sms_template_variables },
              );
            }

            console.log('sms sent');

            // /************************************** */
            // let whatsapp_variables = this.message_template_variables[body.type].whatsapp;
            // console.log("w sms sent 1", whatsapp_variables);

            // whatsapp_variables[0].text = response.data.old_id.toString(); // "Application Reference Number: " ;
            // console.log("w sms sent 2", whatsapp_variables);

            // whatsapp_variables[1].text = response.data.transaction_basket_item.fund_isin; // "Mutual Fund Name: " ;
            // console.log("w sms sent 3", whatsapp_variables);

            // whatsapp_variables[2].text = response.data.transaction_basket_item.amount.toString(); // "Investment Amount: " ;
            // console.log("w sms sent 4", whatsapp_variables);

            // whatsapp_variables[3].text = formattedDate; // "Investment Date: " ;
            // console.log("w sms sent 5", whatsapp_variables);

            // let whatsappResp = await this.msg91Service.sendWhatsapp(user.mobile, this.message_templates['mf_purchase.successful'].whatsapp, whatsapp_variables);

            // console.log("whatsapp sent");

            // /**************************************** */

            // let recipient = { name: user.full_name, email: user.email };
            // let email_variables = this.message_template_variables[body.type].email;
            // email_variables.Transaction_Reference_Number = response.data.old_id;
            // email_variables.Mutual_Fund_Name = response.data.transaction_basket_item.fund_isin;
            // email_variables.Purchase_Amount = response.data.transaction_basket_item.amount;
            // email_variables.Transaction_Date = formattedDate;
            // let emailResp = await this.msg91Service.sendEmail(this.message_templates['mf_purchase.successful'].email, recipient, email_variables)

            // console.log("email sent");
          }

          return { status: HttpStatus.OK, data: response.data };
        }
      } else if (
        body.type == 'mf_redemption.created' ||
        body.type == 'mf_redemption.confirmed' ||
        body.type == 'mf_redemption.submitted' ||
        body.type == 'mf_redemption.successful' ||
        body.type == 'mf_redemption.failed' ||
        body.type == 'mf_redemption.cancelled' ||
        body.type == 'mf_redemption.reversed'
      ) {
        const response = await this.update_redemption_object(body.data.object);
        if (response.status == HttpStatus.OK) {
          const user = await this.userRepository.findOne({
            where: { id: response.data.user_id },
          });
          const sms = msg91.getSMS();

          if (body.type == 'mf_redemption.successful') {
            const sms_template_variables =
              this.message_template_variables['mf_redemption.successful'].sms;
            sms_template_variables.TransactionReferenceNumber =
              response.data.old_id;
            sms_template_variables.RedemptionAmount =
              response.data.transaction_basket_item.amount;

            const date = new Date(response.data.created_at);

            const day = date.getDate().toString().padStart(2, '0'); // Get the day and ensure it has two digits
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (note: months are zero-based) and ensure it has two digits
            const year = date.getFullYear().toString(); // Get the year

            const formattedDate = `${day}-${month}-${year}`;

            sms_template_variables.TransactionDate = formattedDate;
            sms_template_variables.MutualFundName =
              response.data.transaction_basket_item.fund_isin;

            console.log(
              'template id',
              this.message_templates['mf_redemption.successful'].sms,
            );
            console.log('sms options', {
              mobile: '+91' + user.mobile,
              ...sms_template_variables,
            });
            console.log('sms');

            const smsresp = sms.send(
              this.message_templates['mf_redemption.successful'].sms,
              { mobile: '+91' + user.mobile, ...sms_template_variables },
            );

            console.log('sms sent');

            /************************************** */
            // let whatsapp_variables = this.message_template_variables['mf_redemption.successful'].whatsapp;
            // console.log("w sms sent 1", whatsapp_variables);

            // whatsapp_variables[0].text = response.data.old_id.toString(); // "Application Reference Number: " ;
            // console.log("w sms sent 2", whatsapp_variables);

            // whatsapp_variables[1].text = response.data.transaction_basket_item.fund_isin; // "Mutual Fund Name: " ;
            // console.log("w sms sent 3", whatsapp_variables);

            // whatsapp_variables[2].text = response.data.transaction_basket_item.amount.toString(); // "Investment Amount: " ;
            // console.log("w sms sent 4", whatsapp_variables);

            // whatsapp_variables[3].text = formattedDate; // "Investment Date: " ;
            // console.log("w sms sent 5", whatsapp_variables);

            // let whatsappResp = await this.msg91Service.sendWhatsapp(user.mobile, this.message_templates['mf_redemption.successful'].whatsapp, whatsapp_variables);

            // console.log("whatsapp sent");

            // /**************************************** */

            // let recipient = { name: user.full_name, email: user.email };
            // let email_variables = this.message_template_variables[body.type].email;
            // email_variables.Transaction_Reference_Number = response.data.old_id;
            // email_variables.Mutual_Fund_Name = response.data.transaction_basket_item.fund_isin;
            // email_variables.Redemption_Amount = response.data.transaction_basket_item.amount;
            // email_variables.Transaction_Date = formattedDate;
            // let emailResp = await this.msg91Service.sendEmail(this.message_templates['mf_redemption.successful'].email, recipient, email_variables)

            // console.log("email sent");
          }

          return { status: HttpStatus.OK, data: response.data };
        }
      } else if (
        body.type == 'mf_switch.created' ||
        body.type == 'mf_switch.confirmed' ||
        body.type == 'mf_switch.submitted' ||
        body.type == 'mf_switch.successful' ||
        body.type == 'mf_switch.failed' ||
        body.type == 'mf_switch.cancelled' ||
        body.type == 'mf_switch.reversed'
      ) {
        const response = await this.update_switch_object(body.data.object);
        if (response.status == HttpStatus.OK) {
          const user = await this.userRepository.findOne({
            where: { id: response.data.user_id },
          });
          const sms = msg91.getSMS();

          if (body.type == 'mf_switch.successful') {
            const sms_template_variables =
              this.message_template_variables['mf_switch.successful'].sms;
            sms_template_variables.TransactionReferenceNumber =
              response.data.old_id;
            sms_template_variables.SwitchedAmount =
              response.data.transaction_basket_item.amount;

            const date = new Date(response.data.created_at);

            const day = date.getDate().toString().padStart(2, '0'); // Get the day and ensure it has two digits
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (note: months are zero-based) and ensure it has two digits
            const year = date.getFullYear().toString(); // Get the year

            const formattedDate = `${day}-${month}-${year}`;

            sms_template_variables.TransactionDate = formattedDate;
            sms_template_variables.SourceMutualFundName =
              response.data.transaction_basket_item.fund_isin;
            sms_template_variables.DestinationMutualFundName =
              response.data.transaction_basket_item.to_fund_isin;

            console.log(
              'template id',
              this.message_templates['mf_switch.successful'].sms,
            );
            console.log('sms options', {
              mobile: '+91' + user.mobile,
              ...sms_template_variables,
            });
            console.log('sms');

            const smsresp = sms.send(
              this.message_templates['mf_switch.successful'].sms,
              { mobile: '+91' + user.mobile, ...sms_template_variables },
            );

            console.log('sms sent');

            /************************************** */
            // let whatsapp_variables = this.message_template_variables[body.type].whatsapp;
            // console.log("w sms sent 1", whatsapp_variables);

            // whatsapp_variables[0].text = response.data.old_id.toString(); // "Application Reference Number: " ;
            // console.log("w sms sent 2", whatsapp_variables);

            // whatsapp_variables[1].text = response.data.transaction_basket_item.fund_isin; // "Mutual Fund Name: " ;
            // console.log("w sms sent 3", whatsapp_variables);

            // whatsapp_variables[2].text = response.data.transaction_basket_item.to_fund_isin; // "Mutual Fund Name: " ;
            // console.log("w sms sent 3", whatsapp_variables);

            // whatsapp_variables[3].text = response.data.transaction_basket_item.amount.toString(); // "Investment Amount: " ;
            // console.log("w sms sent 4", whatsapp_variables);

            // whatsapp_variables[4].text = formattedDate; // "Investment Date: " ;
            // console.log("w sms sent 5", whatsapp_variables);

            // let whatsappResp = await this.msg91Service.sendWhatsapp(user.mobile, this.message_templates['mf_switch.successful'].whatsapp, whatsapp_variables);

            // console.log("whatsapp sent");

            /**************************************** */

            // let recipient = { name: user.full_name, email: user.email };
            // let email_variables = this.message_template_variables['mf_switch.successful'].email;
            // email_variables.Transaction_Reference_Number = response.data.old_id;
            // email_variables.Source_Mutual_Fund_Name = response.data.transaction_basket_item.fund_isin;
            // email_variables.Destination_Mutual_Fund_Name = response.data.transaction_basket_item.to_fund_isin;
            // email_variables.Switched_Amount = response.data.transaction_basket_item.amount;
            // email_variables.Transaction_Date = formattedDate;
            // let emailResp = await this.msg91Service.sendEmail(this.message_templates['mf_switch.successful'].email, recipient, email_variables)

            // console.log("email sent");
          }

          return { status: HttpStatus.OK, data: response.data };
        }
      } else if (
        body.type == 'kyc_request.successful' ||
        body.type == 'kyc_request.rejected' ||
        body.type == 'kyc_request.submitted' ||
        body.type == 'kyc_request.esign_required'
      ) {
        const response = await this.update_kyc_object(body.data.object);
        if (response.status == HttpStatus.OK) {
          const user = await this.userRepository.findOne({
            where: { id: response.data.user_id },
          });
          const sms = msg91.getSMS();

          // if(body.type == "kyc_request.successful"){
          //     let sms_template_variables = this.message_template_variables['kyc_request.successful'].sms;
          //     sms_template_variables.TransactionReferenceNumber = response.data.old_id;
          //     sms_template_variables.SwitchedAmount = response.data.transaction_basket_item.amount;

          //     const date = new Date(response.data.created_at);

          //     const day = date.getDate().toString().padStart(2, '0'); // Get the day and ensure it has two digits
          //     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get the month (note: months are zero-based) and ensure it has two digits
          //     const year = date.getFullYear().toString(); // Get the year

          //     const formattedDate = `${day}-${month}-${year}`;

          //     sms_template_variables.TransactionDate = formattedDate;
          //     sms_template_variables.SourceMutualFundName = response.data.transaction_basket_item.fund_isin;
          //     sms_template_variables.DestinationMutualFundName = response.data.transaction_basket_item.to_fund_isin;

          //     console.log("template id", this.message_templates['kyc_request.successful'].sms);
          //     console.log("sms options", {'mobile':"+91" + user.mobile , ...sms_template_variables});
          //    console.log("sms");

          //    let smsresp = sms.send(this.message_templates['kyc_request.successful'].sms,{'mobile':"+91" + user.mobile , ...sms_template_variables});

          //     console.log("sms sent");

          //    /************************************** */
          //    let whatsapp_variables = this.message_template_variables[body.type].whatsapp;
          //    console.log("w sms sent 1",whatsapp_variables);

          //     whatsapp_variables[0].text = response.data.old_id.toString(); // "Application Reference Number: " ;
          //    console.log("w sms sent 2",whatsapp_variables);

          //     whatsapp_variables[1].text = response.data.transaction_basket_item.fund_isin; // "Mutual Fund Name: " ;
          //    console.log("w sms sent 3",whatsapp_variables);

          //    whatsapp_variables[2].text = response.data.transaction_basket_item.to_fund_isin; // "Mutual Fund Name: " ;
          //    console.log("w sms sent 3",whatsapp_variables);

          //     whatsapp_variables[3].text = response.data.transaction_basket_item.amount.toString(); // "Investment Amount: " ;
          //    console.log("w sms sent 4",whatsapp_variables);

          //     whatsapp_variables[4].text = formattedDate; // "Investment Date: " ;
          //    console.log("w sms sent 5",whatsapp_variables);

          //    let whatsappResp = await this.msg91Service.sendWhatsapp(user.mobile,this.message_templates['kyc_request.successful'].whatsapp,whatsapp_variables);

          //    console.log("whatsapp sent");

          //    /**************************************** */

          //    let recipient = { name: user.full_name, email: user.email };
          //    let email_variables = this.message_template_variables['kyc_request.successful'].email;
          //    email_variables.Transaction_Reference_Number = response.data.old_id;
          //    email_variables.Source_Mutual_Fund_Name = response.data.transaction_basket_item.fund_isin;
          //    email_variables.Destination_Mutual_Fund_Name = response.data.transaction_basket_item.to_fund_isin;
          //    email_variables.Switched_Amount = response.data.transaction_basket_item.amount;
          //    email_variables.Transaction_Date = formattedDate;
          //    let emailResp = await this.msg91Service.sendEmail(this.message_templates['kyc_request.successful'].email,recipient,email_variables)

          //     console.log("email sent");

          // }

          return { status: HttpStatus.OK, data: response.data };
        }
      } else if (
        body.type == 'mandate.created' ||
        body.type == 'mandate.received' ||
        body.type == 'mandate.submitted' ||
        body.type == 'mandate.approved' ||
        body.type == 'mandate.rejected' ||
        body.type == 'mandate.cancelled'
      ) {
        const response = await this.update_mandate_object(body.data.object);
        return { status: HttpStatus.OK, data: response.data };
      } else if (
        body.type == 'mf_purchase_plan.created' ||
        body.type == 'mf_purchase_plan.activated' ||
        body.type == 'mf_purchase_plan.cancelled' ||
        body.type == 'mf_purchase_plan.failed' ||
        body.type == 'mf_purchase_plan.completed'
      ) {
        const response = await this.update_purchase_plan(body.data.object);
        return { status: HttpStatus.OK, data: response.data };
      } else if (
        body.type == 'mf_redemption_plan.created' ||
        body.type == 'mf_redemption_plan.activated' ||
        body.type == 'mf_redemption_plan.cancelled' ||
        body.type == 'mf_redemption_plan.failed' ||
        body.type == 'mf_redemption_plan.completed'
      ) {
        const response = await this.update_redemption_plan(body.data.object);
        return { status: HttpStatus.OK, data: response.data };
      } else if (
        body.type == 'mf_switch_plan.created' ||
        body.type == 'mf_switch_plan.activated' ||
        body.type == 'mf_switch_plan.cancelled' ||
        body.type == 'mf_switch_plan.failed' ||
        body.type == 'mf_switch_plan.completed'
      ) {
        const response = await this.update_switch_plan(body.data.object);
        return { status: HttpStatus.OK, data: response.data };
      }
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, error: error.message };
    }
  }

  async update_purchase_plan(body: any) {
    try {
      let transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.findOne({
          where: { fp_sip_id: body.id },
        });
      transaction_basket_item_plan.status = body.state;
      transaction_basket_item_plan.start_date = body.start_date;
      transaction_basket_item_plan.end_date = body.start_date;
      transaction_basket_item_plan.activated_at = body.activated_at;
      transaction_basket_item_plan.cancelled_at = body.cancelled_at;
      transaction_basket_item_plan.completed_at = body.completed_at;
      transaction_basket_item_plan.failed_at = body.failed_at;
      transaction_basket_item_plan.installment_day = body.installment_day;
      transaction_basket_item_plan.next_installment_date =
        body.next_installment_date;
      transaction_basket_item_plan.previous_installment_date =
        body.previous_installment_date;
      transaction_basket_item_plan.remaining_installments =
        body.remaining_installments;

      transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.save(
          transaction_basket_item_plan,
        );

      return { status: HttpStatus.OK, data: transaction_basket_item_plan };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_switch_plan(body: any) {
    try {
      let transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.findOne({
          where: { fp_sip_id: body.id },
        });
      transaction_basket_item_plan.status = body.state;
      transaction_basket_item_plan.start_date = body.start_date;
      transaction_basket_item_plan.end_date = body.start_date;
      transaction_basket_item_plan.activated_at = body.activated_at;
      transaction_basket_item_plan.cancelled_at = body.cancelled_at;
      transaction_basket_item_plan.completed_at = body.completed_at;
      transaction_basket_item_plan.failed_at = body.failed_at;
      transaction_basket_item_plan.installment_day = body.installment_day;
      transaction_basket_item_plan.next_installment_date =
        body.next_installment_date;
      transaction_basket_item_plan.previous_installment_date =
        body.previous_installment_date;
      transaction_basket_item_plan.remaining_installments =
        body.remaining_installments;

      transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.save(
          transaction_basket_item_plan,
        );

      return { status: HttpStatus.OK, data: transaction_basket_item_plan };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_redemption_plan(body: any) {
    try {
      let transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.findOne({
          where: { fp_sip_id: body.id },
        });
      transaction_basket_item_plan.status = body.state;
      transaction_basket_item_plan.start_date = body.start_date;
      transaction_basket_item_plan.end_date = body.start_date;
      transaction_basket_item_plan.activated_at = body.activated_at;
      transaction_basket_item_plan.cancelled_at = body.cancelled_at;
      transaction_basket_item_plan.completed_at = body.completed_at;
      transaction_basket_item_plan.failed_at = body.failed_at;
      transaction_basket_item_plan.installment_day = body.installment_day;
      transaction_basket_item_plan.next_installment_date =
        body.next_installment_date;
      transaction_basket_item_plan.previous_installment_date =
        body.previous_installment_date;
      transaction_basket_item_plan.remaining_installments =
        body.remaining_installments;

      transaction_basket_item_plan =
        await this.transactionBasketItemsRepository.save(
          transaction_basket_item_plan,
        );

      return { status: HttpStatus.OK, data: transaction_basket_item_plan };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_purchase_object(body: any) {
    try {
      let purchase: Purchase;

      purchase = await this.purchaseRepository.findOne({
        where: { fp_id: body.id },
        relations: ['transaction_basket_item'],
      });
      console.log('update purchase obj', purchase);
      // let user = purchase ? await this.userRepository.findOne({ where: { id: purchase.user_id } }):null;
      if (!purchase && body.plan != null) {
        purchase = new Purchase();
        purchase.fp_id = body.id;
        purchase.transaction_basket_item =
          await this.transactionBasketItemsRepository.findOne({
            where: { fp_sip_id: body.plan },
            relations: ['transaction_basket', 'user'],
          });
        // user =  purchase.transaction_basket_item.user;
        // purchase.user = purchase.transaction_basket_item.user;
        purchase.user_id = purchase.transaction_basket_item.user_id;

        const sip_response = await this.fintechService.fetch_sip(purchase.plan);
        if (sip_response.status == HttpStatus.OK) {
          const sip = sip_response.data;

          purchase.transaction_basket_item.status = sip.state;

          purchase.remaining_installments = sip.remaining_installments;
          purchase.next_installment_date = sip.next_installment_date;
          purchase.requested_activation_date = sip.requested_activation_date;

          console.log('fpweb_purchase', purchase);
        }
      } else {
        if (
          purchase.transaction_basket_item.transaction_type != 'sip' &&
          purchase.transaction_basket_item.transaction_type != 'no_mandate_sip'
        ) {
          purchase.transaction_basket_item.status = body.state;
        }
      }
      purchase.old_id = body.old_id;
      purchase.state = body.state;
      purchase.folio_number = body.folio_number;
      purchase.cancelled_at = body.cancelled_at;
      purchase.completed_at = body.completed_at;
      purchase.failed_at = body.failed_at;
      purchase.reversed_at = body.reversed_at;
      purchase.submitted_at = body.submitted_at;
      purchase.succeeded_at = body.succeeded_at;
      purchase.scheduled_on = body.scheduled_on;
      purchase.traded_on = body.traded_on;
      purchase.allotted_units = body.allotted_units;
      purchase.traded_on = body.traded_on;
      purchase.purchased_price = body.purchased_price;
      purchase.retried_at = body.retried_at;
      purchase.confirmed_at = body.confirmed_at;
      purchase.failure_code = body.failure_code;
      purchase.euin = body.euin;
      purchase.activated_at = body.activated_at;
      purchase.folio_number = body.folio_number;
      purchase.created_at = body.created_at;
      purchase.euin = body.euin;
      purchase.scheme = body.scheme;
      purchase.plan = body.plan;

      purchase = await this.purchaseRepository.save(purchase);

      purchase.transaction_basket_item.folio_number = body.folio_number;

      await this.transactionBasketItemsRepository.save(
        purchase.transaction_basket_item,
      );

      return { status: HttpStatus.OK, data: purchase };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_redemption_object(body: any) {
    try {
      let redemption: Redemption;

      redemption = await this.redemptionRepository.findOne({
        where: { fp_id: body.id },
        relations: ['transaction_basket_item'],
      });
      // let user = await this.userRepository.findOne({ where: { id: redemption.user_id } });
      if (!redemption && body.plan != null) {
        redemption = new Redemption();
        redemption.fp_id = body.id;
        redemption.transaction_basket_item =
          await this.transactionBasketItemsRepository.findOne({
            where: { fp_swp_id: body.plan },
            relations: ['transaction_basket', 'user'],
          });
        // purchase.user = purchase.transaction_basket_item.user;
        redemption.user_id = redemption.transaction_basket_item.user_id;
      }
      redemption.old_id = body.old_id;
      redemption.state = body.state;
      redemption.folio_number = body.folio_number;
      redemption.redeemed_amount = body.redeemed_amount;
      redemption.redeemed_units = body.redeemed_units;
      redemption.redeemed_price = body.redeemed_price;
      redemption.units = body.units;
      redemption.amount = body.amount;

      redemption.failed_at = body.failed_at;
      redemption.reversed_at = body.reversed_at;
      redemption.submitted_at = body.submitted_at;
      redemption.succeeded_at = body.succeeded_at;
      redemption.scheduled_on = body.scheduled_on;
      redemption.traded_on = body.traded_on;

      // redemption.redemption_mode = body.redemption_mode;
      redemption.confirmed_at = body.confirmed_at;
      redemption.redemption_bank_account_number =
        body.redemption_bank_account_number;
      redemption.euin = body.euin;
      redemption.redemption_bank_account_ifsc_code =
        body.redemption_bank_account_ifsc_code;
      redemption.folio_number = body.folio_number;
      redemption.created_at = body.created_at;
      redemption.euin = body.euin;
      redemption.scheme = body.scheme;
      redemption.plan = body.plan;
      redemption.failure_code = body.failure_code;
      redemption.initiated_by = body.initiated_by;
      redemption.initiated_via = body.initiated_via;

      redemption = await this.redemptionRepository.save(redemption);

      redemption.transaction_basket_item.status = body.state;
      redemption.transaction_basket_item.folio_number = body.folio_number;

      await this.transactionBasketItemsRepository.save(
        redemption.transaction_basket_item,
      );

      return { status: HttpStatus.OK, data: redemption };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_switch_object(body: any) {
    try {
      let switchFund: SwitchFunds;

      switchFund = await this.switchFundsRepository.findOne({
        where: { fp_id: body.id },
        relations: ['transaction_basket_item'],
      });
      // let user = await this.userRepository.findOne({ where: { id: switchFund.user_id } });
      if (!switchFund && body.plan != null) {
        switchFund = new SwitchFunds();
        switchFund.fp_id = body.id;
        switchFund.transaction_basket_item =
          await this.transactionBasketItemsRepository.findOne({
            where: { fp_stp_id: body.plan },
            relations: ['transaction_basket', 'user'],
          });
        // purchase.user = purchase.transaction_basket_item.user;
        switchFund.user_id = switchFund.transaction_basket_item.user_id;
      }
      switchFund.old_id = body.old_id;
      switchFund.state = body.state;
      switchFund.folio_number = body.folio_number;
      switchFund.units = body.units;
      switchFund.amount = body.amount;

      switchFund.failed_at = body.failed_at;
      switchFund.reversed_at = body.reversed_at;
      switchFund.submitted_at = body.submitted_at;
      switchFund.succeeded_at = body.succeeded_at;
      switchFund.scheduled_on = body.scheduled_on;
      switchFund.traded_on = body.traded_on;

      switchFund.confirmed_at = body.confirmed_at;
      switchFund.euin = body.euin;
      switchFund.folio_number = body.folio_number;
      switchFund.created_at = body.created_at;
      switchFund.euin = body.euin;
      switchFund.switch_in_scheme = body.switch_in_scheme;
      switchFund.switch_out_scheme = body.switch_out_scheme;
      switchFund.switched_out_price = body.switched_out_price;
      switchFund.switched_in_price = body.switched_in_price;
      switchFund.switched_out_units = body.switched_out_units;
      switchFund.switched_in_units = body.switched_in_units;
      switchFund.switched_out_amount = body.switched_out_amount;
      switchFund.switched_in_amount = body.switched_in_amount;
      switchFund.gateway = body.gateway;
      switchFund.partner = body.partner;
      switchFund.plan = body.plan;
      switchFund.failure_code = body.failure_code;
      switchFund.initiated_by = body.initiated_by;
      switchFund.initiated_via = body.initiated_via;

      switchFund = await this.switchFundsRepository.save(switchFund);

      switchFund.transaction_basket_item.status = body.state;
      switchFund.transaction_basket_item.folio_number = body.folio_number;

      await this.transactionBasketItemsRepository.save(
        switchFund.transaction_basket_item,
      );

      return { status: HttpStatus.OK, data: switchFund };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_kyc_object(body: any) {
    try {
      let user_onboarding_details: UserOnboardingDetails;
      user_onboarding_details =
        await this.userOnboardingDetailsRepository.findOne({
          where: { kyc_id: body.id },
        });

      user_onboarding_details.fp_kyc_status = body.status;
      user_onboarding_details.fp_kyc_reject_reasons = JSON.stringify(
        body.verification,
      );
      user_onboarding_details.successful_at = body.successful_at;
      user_onboarding_details.rejected_at = body.rejected_at;

      user_onboarding_details = await this.userOnboardingDetailsRepository.save(
        user_onboarding_details,
      );

      return { status: HttpStatus.OK, data: user_onboarding_details };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  async update_mandate_object(body: any) {
    try {
      let mandate: Mandates;
      mandate = await this.mandatesRepository.findOne({
        where: { mandate_id: body.id },
      });

      mandate.status = body.mandate_status;
      mandate.rejected_reason = body.reject_reasons;
      mandate.rejected_at = body.rejected_at;
      mandate.received_at = body.received_at;
      mandate.approved_at = body.approved_at;
      mandate.submitted_at = body.submitted_at;
      mandate.cancelled_at = body.cancelled_at;
      mandate.mandate_limit = body.mandate_limit;
      mandate.valid_from = body.valid_from;

      mandate = await this.mandatesRepository.save(mandate);

      return { status: HttpStatus.OK, data: mandate };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, data: err.message };
    }
  }

  // async test() {
  //     await this.msg91Service.sendWhatsapp('9739561349', 'mutual_fund_purchase_confirmation', [{ type: 'text', text: 'testing it' }, { type: 'text', text: 'text' }, { type: 'text', text: 'text' }, { type: 'text', text: 'text' }]);
  //     return { status: HttpStatus.OK, data: {} };
  // }
}
