import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateKraVerificationDto } from './dto/create-kra_verification.dto';
import { UpdateKraVerificationDto } from './dto/update-kra_verification.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';

@Injectable()
export class KraVerificationService {
  cams_base_url: string;
  cams_user_id: string;
  cams_password: string;
  cams_passkey: string;
  cams_poscode: string;
  constructor(private readonly httpService: HttpService) {
    const configService = new ConfigService();
    this.cams_base_url = configService.get('CAMSKRA_UATURL');
    this.cams_user_id = configService.get('CAMSKRA_USER_ID');
    this.cams_password = configService.get('CAMSKRA_PASSWORD');
    this.cams_passkey = configService.get('CAMSKRA_PASSKEY');
    this.cams_poscode = configService.get('CAMSKRA_POSCODE');
  }

  async getPassword() {
    try {
      const headersRequest = {
        'Content-Type': 'text/xml',
      };

      const bodyRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <GetPassword xmlns="https://camskra.com/">
            <PASSWORD>${this.cams_password}</PASSWORD>
            <PASSKEY>${this.cams_passkey}</PASSKEY>
          </GetPassword>
        </soap:Body>
      </soap:Envelope>`;

      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(`${this.cams_base_url}`, bodyRequest, { headers: headersRequest })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async kyc_check(body: any) {
    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      console.log('Date', formattedDate);

      const headersRequest = {
        'Content-Type': 'text/xml',
      };

      const bodyRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
              <VerifyPANDetails xmlns="https://camskra.com/">
                <InputXML>
                    <APP_REQ_ROOT>
                        <APP_PAN_INQ>
                          <APP_PAN_NO>${body.pan}</APP_PAN_NO>
                          <APP_PAN_DOB>${body.dob}</APP_PAN_DOB>
                          <APP_IOP_FLG>RE</APP_IOP_FLG>
                          <APP_POS_CODE>${this.cams_poscode}</APP_POS_CODE>
                        </APP_PAN_INQ>
                        <APP_SUMM_REC>
                          <APP_OTHKRA_CODE>${this.cams_user_id}</APP_OTHKRA_CODE>
                          <APP_OTHKRA_BATCH>8987897</APP_OTHKRA_BATCH> 
                          <APP_REQ_DATE>${formattedDate}</APP_REQ_DATE>
                          <APP_TOTAL_REC>1</APP_TOTAL_REC>
                        </APP_SUMM_REC>
                      </APP_REQ_ROOT>
                </InputXML>
                <USERNAME>${this.cams_user_id}</USERNAME>
                <POSCODE>${this.cams_poscode}</POSCODE>
                <PASSWORD>${body.password}</PASSWORD>
                <PASSKEY>${this.cams_passkey}</PASSKEY>
              </VerifyPANDetails>
            </soap:Body>
        </soap:Envelope>`;

      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(`${this.cams_base_url}`, bodyRequest, { headers: headersRequest })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async kyc_check_ekyc(body: any) {
    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();

      const formattedDate = `${day}-${month}-${year}`;
      console.log('Date', formattedDate);

      const headersRequest = {
        'Content-Type': 'text/xml',
      };

      const bodyRequest = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <DownloadPANDetails_eKYC xmlns="https://camskra.com/">
                <InputXML>
                    <APP_REQ_ROOT>
                        <APP_PAN_INQ>
                            <APP_PAN_NO>${body.pan}</APP_PAN_NO>
                            <APP_PAN_DOB>${body.dob}</APP_PAN_DOB>
                            <APP_IOP_FLG>RE</APP_IOP_FLG>
                            <APP_POS_CODE>${this.cams_poscode}</APP_POS_CODE>
                        </APP_PAN_INQ>
                        <APP_SUMM_REC>
                            <APP_OTHKRA_CODE>${this.cams_user_id}</APP_OTHKRA_CODE>
                            <APP_OTHKRA_BATCH>05062020</APP_OTHKRA_BATCH>
                            <APP_REQ_DATE>${formattedDate}</APP_REQ_DATE>
                            <APP_TOTAL_REC>1</APP_TOTAL_REC>
                        </APP_SUMM_REC>
                    </APP_REQ_ROOT>
                </InputXML>
                  <USERNAME>${this.cams_user_id}</USERNAME>
                  <POSCODE>${this.cams_poscode}</POSCODE>
                  <PASSWORD>${body.password}</PASSWORD>
                  <PASSKEY>${this.cams_passkey}</PASSKEY>
            </DownloadPANDetails_eKYC>
        </soap:Body>
      </soap:Envelope>`;

      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(`${this.cams_base_url}`, bodyRequest, { headers: headersRequest })
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in fp auth ', e);
            if (e.response && e.response.data && e.response.data.error) {
              console.log('Les', e.response.data.error);
              e.response.data.error.message = '';
              e.response.data.error.errors.map((er) => {
                e.response.data.error.message +=
                  er.field + ' : ' + er.message + '. ';
              });
            }

            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('result', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  create(createKraVerificationDto: CreateKraVerificationDto) {
    return 'This action adds a new kraVerification';
  }

  findAll() {
    return `This action returns all kraVerification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} kraVerification`;
  }

  update(id: number, updateKraVerificationDto: UpdateKraVerificationDto) {
    return `This action updates a #${id} kraVerification`;
  }

  remove(id: number) {
    return `This action removes a #${id} kraVerification`;
  }
}
