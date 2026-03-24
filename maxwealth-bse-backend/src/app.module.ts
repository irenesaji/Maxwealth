import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './utils/notifications/notifications.module';
import { FintechModule } from './utils/fintech/fintech.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import ormconfig from '../typeOrmCon.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { BankModule } from './onboarding/bank/bank.module';
import { NomineeModule } from './onboarding/nominee/nominee.module';
import { ProofsModule } from './onboarding/proofs/proofs.module';
import { AddressModule } from './onboarding/address/address.module';
import { RiskProfilesModule } from './risk_profiles/risk_profiles.module';
import { MandatesModule } from './mandates/mandates.module';
import { TransactionBasketsModule } from './transaction_baskets/transaction_baskets.module';
import { GoalsModule } from './goals/goals.module';
import { ModelPortfolioModule } from './model_portfolio/model_portfolio.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { OrderStatusModule } from './order_status/order_status.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MutualfundsModule } from './utils/mutualfunds/mutualfunds.module';
import { SmartsipConfigModule } from './smartsip_config/smartsip_config.module';
import { FpCronsModule } from './crons/fp_crons/fp_crons.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule as AdminUsersModule } from './admin/users/users.module';
import { AdminModelPortfoliosModule } from './admin/admin_model_portfolios/admin_model_portfolios.module';
import { AdminModelPortfolioFundsModule } from './admin/admin_model_portfolio_funds/admin_model_portfolio_funds.module';
import { AdminRiskProfilesModule } from './admin/admin_risk_profiles/admin_risk_profiles.module';
import { AdminRiskAnswerWeightagesModule } from './admin/admin_risk_answer_weightages/admin_risk_answer_weightages.module';
import { AdminRiskProfileQuestionsModule } from './admin/admin_risk_profile_questions/admin_risk_profile_questions.module';
import { AdminRiskAnswerChoicesModule } from './admin/admin_risk_answer_choices/admin_risk_answer_choices.module';
import { AdminGoalsModule } from './admin/admin_goals/admin_goals.module';
import { AdminReportsModule } from './admin/admin_reports/admin_reports.module';
import { ZohoModule } from './utils/zoho/zoho.module';
import { FpwebhooksModule } from './utils/fpwebhooks/fpwebhooks.module';
import { PichainModule } from './utils/pichain/pichain.module';
import { AdminOnboardingModule } from './admin/admin_onboarding/admin_onboarding.module';
import { Msg91Module } from './utils/msg91/msg91.module';
import { CsvModule } from './utils/csv/csv.module';
import { TenantCheckMiddleware } from './middlewares/tenant_check.middleware';
import { TenancyModule } from './tenancy/tenancy.module';
import { UsersRepository } from './repositories/user.repository';
import { CustomEmailvalidation } from './validators/custom_email.validation';
import { GoogleAiModule } from './utils/google_ai/google_ai.module';
import { EnablexService } from './utils/enablex/enablex.service';
import { EnablexModule } from './utils/enablex/enablex.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ReminderService } from './reminder/reminder.service';
import { AmcsModule } from './amcs/amcs.module';
import { AdminAmcsModule } from './admin/admin_amcs/admin_amcs.module';
import { AdminDematAccountsModule } from './admin/admin_onboarding/admin_demat_accounts/admin_demat_accounts.module';
import { SignzyModule } from './utils/signzy/signzy.module';
import { RazorpayModule } from './utils/razorpay/razorpay.module';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionsourcesModule } from './transactionsources/transactionsources.module';
import { UsergoalsModule } from './usergoals/usergoals.module';
import { IpBlockService } from './utils/ip_block/ip_block.service';
import { BlockedIpRepository } from './repositories/blocked_ip.repository';

import { CamsInvestorMasterFoliosModule } from './cams_investor_master_folios/cams_investor_master_folios.module';
import { KfintechInvestorMasterFoliosModule } from './kfintech_investor_master_folios/kfintech_investor_master_folios.module';
import { KfintechTransactionMasterFoliosModule } from './kfintech_transaction_master_folios/kfintech_transaction_master_folios.module';
import { EmailModule } from './email/email.module';
import { ExcelModule } from './excel/excel.module';
import { DataModule } from './data/data.module';
import { BseService } from './utils/bse/bse.service';
import { BseModule } from './utils/bse/bse.module';
import { FundDetailsModule } from './fund_details/fund_details.module';
import { Bsev1Module } from './utils/bsev1/bsev1.module';
import { TransactionsModule } from './transactions/transactions.module';
import { KraVerificationModule } from './utils/pan_verification/kra_verification/kra_verification.module';
import { Onboardingv2Module } from './onboardingv2/onboardingv2.module';
import { CamsModule } from './utils/cams/cams.module';
import { CamsEncryptDecryptModule } from './utils/cams_encrypt_decrypt/cams_encrypt_decrypt.module';
import { HtmlCleanerModule } from './utils/html-cleaner/html-cleaner.module';
import { FintupleModule } from './utils/fintuple/fintuple.module';

@Module({
  imports: [
    ...ormconfig['typeormOptions'],

    // TypeOrmModule.forRootAsync({
    //   useClass: AppService,
    // }),

    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../uploads'),
      serveRoot: '/uploads/',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    NotificationsModule,
    FintechModule,
    OnboardingModule,
    BankModule,
    NomineeModule,
    ProofsModule,
    AddressModule,
    RiskProfilesModule,
    MandatesModule,
    TransactionBasketsModule,
    GoalsModule,
    ModelPortfolioModule,
    PortfolioModule,
    OrderStatusModule,
    MutualfundsModule,
    SmartsipConfigModule,
    FpCronsModule,
    AdminUsersModule,
    AdminModelPortfoliosModule,
    AdminModelPortfolioFundsModule,
    AdminRiskProfilesModule,
    AdminRiskAnswerWeightagesModule,
    AdminRiskProfileQuestionsModule,
    AdminRiskAnswerChoicesModule,
    AdminGoalsModule,
    AdminReportsModule,
    ZohoModule,
    FpwebhooksModule,
    PichainModule,
    AdminOnboardingModule,
    Msg91Module,
    CsvModule,
    TenancyModule,
    GoogleAiModule,
    EnablexModule,
    HttpModule,
    ConfigModule,
    AmcsModule,
    AdminAmcsModule,
    AdminDematAccountsModule,
    SignzyModule,
    RazorpayModule,
    CamsInvestorMasterFoliosModule,
    KfintechInvestorMasterFoliosModule,
    KfintechTransactionMasterFoliosModule,
    EmailModule,
    ExcelModule,
    DataModule,
    UsergoalsModule,
    BseModule,
    FundDetailsModule,
    Bsev1Module,
    TransactionsModule,
    KraVerificationModule,
    Onboardingv2Module,
    CamsModule,
    CamsEncryptDecryptModule,
    HtmlCleanerModule,
    FintupleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
      scope: Scope.REQUEST,
    },
    UsersRepository,
    CustomEmailvalidation,
    EnablexService,
    IpBlockService,
    BlockedIpRepository,
    BseService,
  ],
  exports: [UsersRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantCheckMiddleware).forRoutes('*');
  }
}
