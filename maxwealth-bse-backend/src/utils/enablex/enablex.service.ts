import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { EntityManager, Repository } from 'typeorm';
import { SmsConfigurationRepository } from 'src/repositories/sms_configuration.repository';
import { EmailConfigurationRepository } from 'src/repositories/email_configuration.repository';

@Injectable()
export class EnablexService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly smsConfigurationRepo: SmsConfigurationRepository,
  ) {}

  async sendSMS(
    phoneNumber: string,
    from: string,
    campaign_id: number,
    type: string,
    template_id: string,
    data: any,
  ): Promise<void> {
    const appId = this.configService.get<string>('ENABLEX_APP_ID');
    const appKey = this.configService.get<string>('ENABLEX_APP_KEY');
    const apiUrl = 'https://api.enablex.io/sms/v1/messages/';
    // const templateId = this.configService.get<string>('ENABLEX_TEMPLATE_ID');
    // const from;
    // const sms;
    console.log(appId, 'fijddjof', appKey);
    console.log('sms');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${appId}:${appKey}`).toString(
        'base64',
      )}`,
    };
    console.log(headers);
    const body = {
      to: [`${phoneNumber}`],
      template_id: template_id, // Replace with the actual template ID provided by EnableX
      campaign_id: campaign_id,
      from: from,
      type: type,
      data: data,
    };
    console.log(body);

    await axios
      .post(apiUrl, body, {
        headers: headers,
      })
      .then((response) => {
        console.log('SMS sent successfully:', response.data);
      })
      .catch((error) => {
        console.error(
          'Error sending SMS:',
          error.response?.data || error.message,
        );
      });
  }

  async hasEnablexSMS() {
    const enablex = await this.smsConfigurationRepo.find();
    if (enablex.length == 0) {
      return false;
    } else {
      const e = enablex.some((enable) => enable.provider === 'enablex');
      if (e) {
        return e;
      } else {
        return false;
      }
    }
  }

  async findOneSms(provider: string) {
    return await this.smsConfigurationRepo.findOne({ where: { provider } });
  }
}
