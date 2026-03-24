import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { MpinDto } from './dtos/mpin.dto';
import { Users } from './entities/users.entity';
// import msg91 from "msg91";
import { ConfigService } from '@nestjs/config';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';
import { ZohoService } from 'src/utils/zoho/zoho.service';
import { ContactDto } from 'src/utils/zoho/dtos/contact.dto';
import * as Papa from 'papaparse';
import { CsvService } from '../utils/csv/csv.service';
// import { Msg91Service } from 'src/utils/msg91/msg91.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersRepository } from 'src/repositories/user.repository';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import { BrevoService } from 'src/utils/brevo/brevo.service';
import { to } from 'mathjs';
import { toUserDTO } from './dtos/user.dto';
// import { EnablexService } from 'src/utils/enablex/enablex.service';
// import { BrevoService } from 'src/utils/brevo/brevo.service';
// import { Msg91Service } from 'src/utils/msg91/msg91.service';
@Injectable()
export class UsersService {
  msg_apikey: string;
  base_url: string;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly notificationService: NotificationsService,
    // private readonly zohoService: ZohoService,
    private readonly csvService: CsvService,
    // private readonly msg91Service: Msg91Service,
    private readonly enablexService: EnablexService,
    private readonly brevoService: BrevoService,
  ) {
    const configService = new ConfigService();
    this.msg_apikey = configService.get('MSG_APIKEY');
    this.base_url = configService.get('BASE_URL');
    try {
      // msg91.initialize({ authKey: this.msg_apikey });
      console.log('replace comment by msg91 initialize');
    } catch (ex) {
      console.log(ex);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('CreateUserDto', createUserDto);

      let user = new Users();

      const emailUser = await this.usersRepository.findOneBy({
        email: createUserDto.email,
      });
      console.log('email', emailUser);
      if (emailUser) {
        if (!emailUser.is_email_verified || !emailUser.mobile_verified) {
          user = emailUser;
          console.log('if_email', user);
        } else if (
          emailUser.is_email_verified == true &&
          emailUser.mobile_verified == true
        ) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'User with email already exists',
          };
        }
      }

      const phoneUser = await this.usersRepository.findOneBy({
        mobile: createUserDto.mobile,
      });
      console.log('mobile', phoneUser);
      if (phoneUser) {
        if (!phoneUser.is_email_verified || !phoneUser.mobile_verified) {
          user = phoneUser;
          console.log('if_mobile', user);
        } else if (
          phoneUser.is_email_verified == true &&
          phoneUser.mobile_verified == true
        ) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'User with phone already exists',
          };
        }
      }
      user.country_code = createUserDto.country_code;
      user.email = createUserDto.email;
      user.full_name = createUserDto.full_name;
      user.mobile = createUserDto.mobile;
      user.is_email_verified = false;
      // user.referral_code = createUserDto.referral_code;
      console.log(user);
      // 392417Ail59d8S3pv64e72637P1

      if (!user.is_lead) {
        // let sms = msg91.getSMS();

        user.otp = Math.floor(1000 + Math.random() * 9000); //1111;
        user.email_otp = Math.floor(1000 + Math.random() * 9000); //1111;

        const send = await this.enablexService.hasEnablexSMS();
        if (send) {
          const sms_data = await this.enablexService.findOneSms('enablex');
          console.log('hi', sms_data.keys_json.from);
          const info = {
            var1: `${user.otp}`,
          };
          this.enablexService.sendSMS(
            user.mobile,
            sms_data.keys_json.from,
            sms_data.keys_json.campaign_id.otp,
            sms_data.keys_json.type,
            sms_data.keys_json.template_id.otp,
            info,
          );
        } else {
          user.otp = 1111;
          // sms.send("64e4b8f7d6fc056dac46c8d2", { 'mobile': "+91" + createUserDto.mobile, "otp": user.otp.toString() });
        }
        // let email = await this.brevoService.hasEmail()
        // if (email) {
        //   let email_data = await this.brevoService.findOneEmail("enablex")
        //   let recipient = { name: user.full_name, email: user.email };
        //   email_data.key_json.variable.otp.OTP = `${user.email_otp}`
        //   let sender = { email: email_data.key_json.sender.email, name: email_data.key_json.sender.name }
        //   this.brevoService.sendTemplateEmail(sender, recipient, email_data.key_json.template_id.otp, email_data.key_json.variable.otp)
        // }

        user = await this.usersRepository.save(user);
        this.notificationService.sendOtp();
      }
      const userdto = toUserDTO(user);
      return { status: HttpStatus.OK, ...user };
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async set_mpin(setMpinDto: MpinDto, user_id) {
    try {
      const user = await this.usersRepository.findOneBy({ id: user_id });
      if (user) {
        user.mpin = setMpinDto.mpin;
        await this.usersRepository.save(user);
        return { status: HttpStatus.OK, message: 'Mpin set successfully' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'user not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async update_settings(
    updateUserSettingsDto: UpdateUserSettingsDto,
    id: number,
  ) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      if (user) {
        user.is_daily_portfolio_updates =
          updateUserSettingsDto.is_daily_portfolio_updates;
        user.is_whatsapp_notifications =
          updateUserSettingsDto.is_whatsapp_notifications;
        user.is_enable_biometrics = updateUserSettingsDto.is_enable_biometrics;
        await this.usersRepository.save(user);
        return { status: HttpStatus.OK, message: 'Settings set successfully' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'user not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async update(user: Users) {
    try {
      console.log('hello');
      console.log(user);
      await this.usersRepository.save(user);
      console.log('hello2');
      return { status: 'success', user: user };
    } catch (err) {
      return { status: 'error', error: err.message };
    }
  }

  async findOneByMobile(mobile: string) {
    try {
      let user = await this.usersRepository.findOne({
        where: { mobile: mobile },
        relations: ['risk_profile'],
      });
      if (user) {
        console.log(user);

        if (user.user_code == null) {
          user.user_code = (10000000 + user.id).toString(36);
          user = await this.usersRepository.save(user);
        }

        return { status: 'success', user: user };
      } else {
        return { status: 'error', message: 'user not found' };
      }
    } catch (err) {
      console.log(err.message);
      return { status: 'error', error: err.message };
    }
  }

  async findOneByEmail(email: string) {
    try {
      let user = await this.usersRepository.findOne({
        where: { email: email },
        relations: ['risk_profile'],
      });
      if (user) {
        if (user.user_code == null) {
          user.user_code = (10000000 + user.id).toString(36);
          user = await this.usersRepository.save(user);
        }

        return { status: 'success', user: user };
      } else {
        return { status: 'error', message: 'user not found' };
      }
    } catch (err) {
      console.log(err.message);

      return { status: 'error', error: err.message };
    }
  }

  async findOneById(id: number) {
    try {
      let user = await this.usersRepository.findOne({
        where: { id: id },
        relations: ['risk_profile'],
      });
      if (user) {
        if (user.user_code == null) {
          user.user_code = (10000000 + user.id).toString(36);
          user = await this.usersRepository.save(user);
        }
        return { status: 'success', user: user };
      } else {
        return { status: 'error', error: 'user not found' };
      }
    } catch (err) {
      console.log(err.message);

      return { status: 'error', error: err.message };
    }
  }

  // @Cron(CronExpression.EVERY_DAY_AT_9PM, { name: 'runDailyLeads' })
  // async sendDailyLeads() {
  //   try {
  //     const today = new Date();
  //     let emails = ['shazad@mindstack.in', 'swastik.poojary@mindstack.in', 'vinod@mileswealth.in'];
  //     today.setDate(today.getDate() - 1)
  //     today.setHours(0, 0, 0, 0);
  //     // let new_users = this.usersRepository.find({where: {is_lead: true,created_at:MoreThanOrEqual(today)},   order: {id: 'DESC'}});
  //     let new_users = await this.usersRepository.find({
  //       order: {
  //         id: 'DESC'
  //       }
  //     });

  //     if (new_users.length > 0) {

  //       console.log("lead count ", new_users.length)

  //       const csvData = Papa.unparse(new_users);
  //       const filePath = 'uploads/csvs/updated_data.csv';
  //       await this.csvService.saveCsvToFile(csvData, filePath);

  //       const url = this.base_url + "/" + filePath;

  //       emails.forEach(async (mailId) => {
  //         await this.msg91Service.sendEmail('leads_updates', { email: mailId }, { 'URL': url });
  //       });
  //     } else {

  //       emails.forEach(async (mailId) => {
  //         await this.msg91Service.sendEmail('no_leads', { email: mailId }, {});

  //       });
  //       console.log("no leads");
  //     }

  //   } catch (err) {
  //     console.log("DAILY LEADS error ", err.message);

  //   }
  // }
}
