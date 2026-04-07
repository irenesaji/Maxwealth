import { Header, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { MpinDto } from 'src/users/dtos/mpin.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/utils/notifications/notifications.service';
import { GenerateOtpDto } from './dtos/generate-otp.dto';
import { VerifyMobileDto } from './dtos/verify-mobile.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { catchError, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import msg91 from 'msg91';
import { ConfigService } from '@nestjs/config';
import { EnablexService } from 'src/utils/enablex/enablex.service';
import appleSignin from 'apple-signin-auth';
import { join } from 'path';
import * as fs from 'fs';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { GenerateEmailOtpDto } from './dtos/generate-email-otp.dto';
// import { Msg91Service } from 'src/utils/msg91/msg91.service';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { BrevoService } from 'src/utils/brevo/brevo.service';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { toUserDTO } from 'src/users/dtos/user.dto';

@Injectable()
export class AuthService {
  msg_apikey: string;
  apple_client_id: string;
  apple_team_id: string;
  apple_key_id: string;
  // configService: any;
  // // configService: ConfigService;
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(UserOnboardingDetails)
    private userOnboardRepo: Repository<UserOnboardingDetails>,
    private readonly httpService: HttpService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly notificationService: NotificationsService,
    private readonly enablexService: EnablexService,
    private configService: ConfigService,
    private brevoService: BrevoService,
  ) {
    // const configService = new ConfigService();
    this.msg_apikey = configService.get('MSG_APIKEY');
    try {
      // msg91.initialize({ authKey: this.msg_apikey });
      console.log('replace comment by msg91 initialize');
    } catch (ex) {
      console.log(ex);
    }
  }

  async validateUser(mobile: string, otp: number): Promise<any> {
    const userData = await this.usersService.findOneByMobile(mobile);
    if (userData.status == 'success') {
      const user = userData.user;
      if (user.otp == otp) {
        return user;
      }
      return null;
    } else {
      return null;
    }
  }

  async login(user: any) {
    console.log(user.user);
    const payload = {
      user: {
        id: user.user.id,
        email: user.user.email,
        full_name: user.user.full_name,
        role: user.user.role,
      },
    };
    // console.log({payload});
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generate_otp(tenant_id, generateOtpDto: GenerateOtpDto) {
    try {
      if (
        typeof generateOtpDto.is_generate == undefined ||
        generateOtpDto.is_generate == null
      ) {
        generateOtpDto.is_generate = true;
      }
      const userData = await this.usersService.findOneByMobile(
        generateOtpDto.mobile,
      );
      if (userData.status == 'success') {
        const user = userData.user;
        if (user.is_blocked == true) {
          return {
            status: HttpStatus.FORBIDDEN,
            error: 'Your account has been blocked',
          };
        }
        user.otp = Math.floor(1000 + Math.random() * 9000); //1111;
        // let sms = msg91.getSMS();
        if (
          user.mobile == '9739561349' ||
          generateOtpDto.is_generate == false
        ) {
          user.otp = 1111;
        }
        const send = await this.enablexService.hasEnablexSMS();
        if (send) {
          const data = await this.enablexService.findOneSms('enablex');
          console.log('hi', data.keys_json.from);
          const info = {
            var1: `${user.otp}`,
          };
          if (generateOtpDto.is_generate) {
            this.enablexService.sendSMS(
              generateOtpDto.mobile,
              data.keys_json.from,
              data.keys_json.campaign_id.otp,
              data.keys_json.type,
              data.keys_json.template_id.otp,
              info,
            );
          }
        } else {
          user.otp = 1111;
          //     // sms.send("64e4b8f7d6fc056dac46c8d2", { 'mobile': "+91" + generateOtpDto.mobile, "otp": user.otp.toString() });
        }

        const otpExpiry = 5 * 60 * 1000;
        setTimeout(async () => {
          const u = await this.usersService.findOneByMobile(user.mobile);
          u.user.otp = Math.floor(1000 + Math.random() * 9000); //1111;
          await this.usersService.update(u.user);
        }, otpExpiry);

        console.log('mai');
        const updateResult = await this.usersService.update(user);
        if (updateResult.status == 'success') {
          const result = this.notificationService.sendOtp();
          if (result) {
            return { status: HttpStatus.OK };
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'SMS not sent, Please try again later',
            };
          }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'user verification did not update',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found, please register',
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async generate_email_otp(generateOtpDto: GenerateEmailOtpDto) {
    try {
      if (
        typeof generateOtpDto.is_generate == undefined ||
        generateOtpDto.is_generate == null
      ) {
        generateOtpDto.is_generate = true;
      }
      const userData = await this.usersService.findOneByEmail(
        generateOtpDto.email,
      );
      if (userData.status == 'success') {
        const user = userData.user;
        if (user.is_blocked == true) {
          return {
            status: HttpStatus.FORBIDDEN,
            error: 'Your account has been blocked',
          };
        }
        user.email_otp = Math.floor(1000 + Math.random() * 9000); //1111 ;
        // let sms = msg91.getSMS();
        if (
          user.mobile == '9739561349' ||
          generateOtpDto.is_generate == false
        ) {
          user.email_otp = 1111;
        }
        const email = await this.brevoService.hasEmail();
        if (email) {
          const email_data = await this.brevoService.findOneEmail('enablex');
          const recipient = { name: user.full_name, email: user.email };
          email_data.key_json.variable.otp.OTP = `${user.email_otp}`;
          const sender = {
            email: email_data.key_json.sender.email,
            name: email_data.key_json.sender.name,
          };
          this.brevoService.sendTemplateEmail(
            sender,
            recipient,
            email_data.key_json.template_id.otp,
            email_data.key_json.variable.otp,
          );
        } else {
          user.email_otp = 1111;
          // sms.send("64e4b8f7d6fc056dac46c8d2", { 'mobile': "+91" + generateOtpDto.mobile, "otp": user.otp.toString() });
        }

        const otpExpiry = 5 * 60 * 1000;
        setTimeout(async () => {
          const u = await this.usersService.findOneByEmail(user.email);
          u.user.email_otp = Math.floor(1000 + Math.random() * 9000); //1111;
          await this.usersService.update(u.user);
        }, otpExpiry);

        console.log('mai');
        const updateResult = await this.usersService.update(user);
        if (updateResult.status == 'success') {
          const result = this.notificationService.sendOtp();
          if (result) {
            return { status: HttpStatus.OK };
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'SMS not sent, Please try again later',
            };
          }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'user verification did not update',
          };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found, please register',
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async verify_otp(verifyOtpDto: VerifyOtpDto) {
    try {
      const verifyMobileDto = new VerifyMobileDto();
      const userData = await this.usersService.findOneByMobile(
        verifyOtpDto.mobile,
      );
      if (userData.status == 'success') {
        const user = userData.user;
        if (verifyOtpDto.fcmToken) {
          user.fcmToken = verifyOtpDto.fcmToken;
        }
        console.log('try it');
        await this.usersService.update(user);
        console.log('make it');

        if (user.otp == verifyOtpDto.otp) {
          const token = await this.login(userData);
          const userDtp = toUserDTO(user);
          return { status: HttpStatus.OK, ...user, ...token };
        } else {
          return { status: HttpStatus.BAD_REQUEST, error: 'Invalid OTP' };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found, please register',
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: 'Invalid OTP' };
    }
  }

  async verify_admin_otp(verifyOtpDto: VerifyOtpDto) {
    const verifyMobileDto = new VerifyMobileDto();
    const userData = await this.usersService.findOneByMobile(
      verifyOtpDto.mobile,
    );
    if (userData.status == 'success') {
      if (userData.user.role == 'User') {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User is not registered as Admin',
        };
      }
      const user = userData.user;
      if (verifyOtpDto.fcmToken) {
        user.fcmToken = verifyOtpDto.fcmToken;
      }
      console.log('try it');
      await this.usersService.update(user);
      console.log('make it');

      if (user.otp == verifyOtpDto.otp) {
        const token = await this.login(userData);
        return { status: HttpStatus.OK, ...user, ...token };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'Invalid OTP' };
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'User not found, please register',
      };
    }
  }

  async mpin_login(mpinDto: MpinDto, user_id: number) {
    const verifyMobileDto = new VerifyMobileDto();
    const userData = await this.usersService.findOneById(user_id);
    if (userData.status == 'success') {
      const user = userData.user;

      if (user.mpin == mpinDto.mpin) {
        const token = await this.login(userData);
        return { status: HttpStatus.OK, ...user, ...token };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'Invalid MPIN' };
      }
    } else {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'User not found, please register',
      };
    }
  }

  async verify_mobile(verifyMobileDto: VerifyMobileDto) {
    try {
      const userData = await this.usersService.findOneById(
        verifyMobileDto.user_id,
      );
      if (userData.status == 'success') {
        const user = userData.user;
        console.log(userData);
        if (user.otp == verifyMobileDto.otp) {
          user.mobile_verified = true;
          user.fcmToken = verifyMobileDto.fcmToken;

          const updateResult = await this.usersService.update(user);
          if (updateResult.status == 'success') {
            console.log(updateResult);
            const token = await this.login(updateResult);
            const userDtp = toUserDTO(user);
            return { status: HttpStatus.OK, ...user, ...token };
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'user verification did not update',
            };
          }
        } else {
          return { status: HttpStatus.BAD_REQUEST, error: 'Invalid OTP' };
        }
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'User not found, please register',
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async verify_email(verifyEmailDto: VerifyEmailDto) {
    try {
      const userData = await this.usersService.findOneById(
        verifyEmailDto.user_id,
      );
      const userinfo = {
        name: userData.user.full_name,
        email: userData.user.email,
      };
      const email_variable = { Client_name: userData.user.full_name };
      if (userData.status == 'success') {
        const user = userData.user;
        console.log(userData);
        if (user.email_otp == verifyEmailDto.otp) {
          user.is_email_verified = true;

          const updateResult = await this.usersService.update(user);
          if (updateResult.status == 'success') {
            //storing referral
            // if (user.referral_code != null) {
            //     let userReferralSettlementDto = new UserReferralSettlementDto();
            //     userReferralSettlementDto.reward_amount = this.reward_amount;
            //     userReferralSettlementDto.status = "registered";
            //     userReferralSettlementDto.user_referred = user.id;
            //     let userReferredBy = await this.usersRepository.findOne({ where: { user_code: user.referral_code } });
            //     if (userReferredBy) {
            //         userReferralSettlementDto.user_referred_by = userReferredBy.id;
            //         this.userReferralSettlementRepository.save(userReferralSettlementDto);
            //     }
            // }

            console.log(updateResult);
            const email = await this.brevoService.hasEmail();
            if (email) {
              const email_data = await this.brevoService.findOneEmail(
                'enablex',
              );
              const recipient = { name: user.full_name, email: user.email };
              // email_data.key_json.variable.otp.OTP = `${user.email_otp}`
              const sender = {
                email: email_data.key_json.sender.email,
                name: email_data.key_json.sender.name,
              };
              this.brevoService.sendTemplateEmail(
                sender,
                recipient,
                email_data.key_json.template_id.welcome,
                email_data.key_json.variable.welcome,
              );
            }
            const variables = [
              {
                type: 'text',
                text: user.full_name,
              },
            ];
            const user_onboarding_details = await this.userOnboardRepo.findOne({
              where: { user_id: user.id },
            });
            if (!user_onboarding_details) {
              const user_onboarding_details = new UserOnboardingDetails();
              user_onboarding_details.user_id = user.id;
              user_onboarding_details.pan = '';
              user_onboarding_details.status = 'not_started';
              await this.userOnboardRepo.save(user_onboarding_details);
            }

            // await this.msg91Service.sendWhatsapp(user.mobile,this.configservice.get("WHATSAPP_WELCOME_TO_FINDOLA"),variables)

            return { status: HttpStatus.OK, message: 'Email verified' };
          } else {
            return {
              status: HttpStatus.BAD_REQUEST,
              error: 'user verification did not update',
            };
          }
        } else {
          return { status: HttpStatus.BAD_REQUEST, error: 'Invalid OTP' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      console.log(err.message);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async verify_apple(token, email, fcmToken, headers) {
    try {
      console.log('verify apple', headers.tenant_id);
      this.apple_client_id = this.configService.get(
        headers.tenant_id.toUpperCase() + '_APPLE_CLIENT_ID',
      );
      this.apple_team_id = this.configService.get(
        headers.tenant_id.toUpperCase() + '_APPLE_TEAM_ID',
      );
      this.apple_key_id = this.configService.get(
        headers.tenant_id.toUpperCase() + '_APPLE_KEY_ID',
      );

      console.log('oye ouye1', this.apple_client_id);
      const authkeyFilePath = join(
        __dirname +
          '/../../../uploads/' +
          headers.tenant_id.toUpperCase() +
          '_AuthKey_' +
          this.apple_key_id +
          '.p8',
      );
      console.log('file fila path', authkeyFilePath);

      const promise = new Promise<any>((resolve, reject) => {
        fs.readFile(authkeyFilePath, 'utf8', async (err, key) => {
          if (err) {
            console.error(err);
            return;
          }

          // Now you can use the file content in the 'data' variable
          console.log(key);

          const clientSecret = await appleSignin.getClientSecret({
            clientID: this.apple_client_id, // Apple Client ID
            teamID: this.apple_team_id, // Apple Developer Team ID.
            privateKey: key, // private key associated with your client ID. -- Or provide a `privateKeyPath` property instead.
            keyIdentifier: this.apple_key_id, // identifier of the private key.
            // OPTIONAL
            expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
          });

          const options = {
            clientID: this.apple_client_id, // Apple Client ID
            redirectUri: '',
            clientSecret: clientSecret,
          };

          try {
            const tokenResponse = await appleSignin.getAuthorizationToken(
              token,
              options,
            );
            console.log('tokenResponse', tokenResponse);

            if (typeof tokenResponse.id_token != 'undefined') {
              const userAppleId = await appleSignin.verifyIdToken(
                tokenResponse.id_token,
              );
              console.log(userAppleId.email);
              if (userAppleId.email) {
                const user_data = await this.usersService.findOneByEmail(
                  userAppleId.email,
                ); // this.usersRepository.findOneBy({email:status.data.email});
                if (user_data.status == 'success') {
                  const user_res = user_data.user;
                  if (user_res.is_blocked == true) {
                    return {
                      status: HttpStatus.FORBIDDEN,
                      error: 'Your account has been blocked',
                    };
                  }

                  user_res.fcmToken = fcmToken;
                  await this.userRepo.save(user_res);
                  const user_obj = {
                    user: {
                      id: user_res.id,
                      email: user_res.email,
                      full_name: user_res.full_name,
                    },
                  };
                  const access_token = await this.jwtService.sign(user_obj);
                  const resp_status = HttpStatus.OK;
                  if (!user_res.mobile_verified) {
                    this.generate_otp(headers.tenant_id, {
                      mobile: user_res.mobile,
                      is_generate: true,
                    });
                    //     resp_status = HttpStatus.BAD_REQUEST;
                  }
                  const userdto = toUserDTO(user_res);
                  resolve({
                    status: resp_status,
                    match: true,
                    access_token: access_token,
                    ...userdto,
                  });
                } else {
                  resolve({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'user not found, please register',
                  });
                }
              } else {
                resolve({
                  status: HttpStatus.BAD_REQUEST,
                  error: 'Invalid Token',
                });
              }
            } else {
              console.log('oooko');
              resolve({
                status: HttpStatus.BAD_REQUEST,
                error: 'Invalid Token',
              });
            }
          } catch (err) {
            console.log('errror', err);
            resolve({ status: HttpStatus.BAD_REQUEST, error: 'Invalid Token' });
          }
        });
      });

      const response = await promise.then((data) => {
        console.log('data', data);
        return data;
      });
      return response;
    } catch (err) {
      return { status: 400, error: 'Invalid Token ' + err.message };
    }
  }

  async verify_google(token, email, fcmToken, header) {
    // try {
    const status = await lastValueFrom(
      this.httpService.get(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' + token,
      ),
    );
    console.log('test google');
    console.log('code', status.request.res.statusCode);
    console.log('data', status.data);
    if (
      status.request.res.statusCode == 200 &&
      status.data &&
      status.data.email
    ) {
      const user_data = await this.usersService.findOneByEmail(
        status.data.email,
      ); // this.usersRepository.findOneBy({email:status.data.email});
      if (user_data.status == 'success') {
        const user_res = user_data.user;
        if (user_res.is_blocked == true) {
          return {
            status: HttpStatus.FORBIDDEN,
            error: 'Your account has been blocked',
          };
        }
        if (fcmToken) {
          user_res.fcmToken = fcmToken;
        }

        await this.usersService.update(user_res);
        const user_obj = {
          user: {
            id: user_res.id,
            email: user_res.email,
            full_name: user_res.full_name,
          },
        };
        const access_token = await this.jwtService.sign(user_obj);
        const resp_status = HttpStatus.OK;
        if (!user_res.mobile_verified) {
          this.generate_otp(header.tenant_id, {
            mobile: user_res.mobile,
            is_generate: true,
          });
          //     resp_status = HttpStatus.BAD_REQUEST;
        }
        const userdto = toUserDTO(user_res);
        return {
          status: resp_status,
          match: true,
          access_token: access_token,
          ...userdto,
        };
      } else {
        return { status: 404, error: 'user not found, please register' };
      }
    } else {
      return { status: 400, error: 'Invalid Token' };
    }
    // } catch (err) {
    //     return { "status": 400, "error": "Invalid Token" };
    // }
  }

  decodeToken(token): any {
    return this.jwtService.decode(token);
  }
}
