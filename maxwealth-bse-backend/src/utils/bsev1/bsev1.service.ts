import {
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateBsev1Dto } from './dto/create-bsev1.dto';
import { UpdateBsev1Dto } from './dto/update-bsev1.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map } from 'rxjs';
import { R } from '@dataui/crud/lib/crud';

@Injectable()
export class Bsev1Service {
  bse_base: string;
  bse_upload_service: string;
  bse_base_url: string;
  user_id: string;
  member_id: string;
  password: string;
  euin: string;
  order_url: string;
  additional_url: string;
  ucc_url: string;
  aof_url: string;
  payment_url: string;
  enach_url: string;

  constructor(
    // @Inject('CONNECTION') dataSource,
    private readonly httpService: HttpService,
  ) {
    const configService = new ConfigService();
    // const maxwealth_tenant_id = dataSource.options.database;
    // this.bse_base_url = configService.get(maxwealth_tenant_id.toUpperCase() + '_BSEV1_BASE_URL')
    // this.user_id = configService.get(maxwealth_tenant_id.toUpperCase() + '_USERID')
    // this.member_id = configService.get(maxwealth_tenant_id.toUpperCase() + '_MEMBERID')
    // this.password = configService.get(maxwealth_tenant_id.toUpperCase() + '_PASSWORD')
    // this.euin = configService.get(maxwealth_tenant_id.toUpperCase() + '_EUIN')
    this.bse_base = configService.get('BSEV1_BASE');
    this.bse_upload_service = configService.get('BSEV1_UPLOAD_SERVICE');
    this.bse_base_url = configService.get('BSEV1_BASE_URL');
    this.user_id = configService.get('USERID');
    this.member_id = configService.get('MEMBERID');
    this.password = configService.get('PASSWORD');
    this.euin = configService.get('EUIN');
    this.order_url = configService.get('ORDER_URL');
    this.additional_url = configService.get('ADDITIONAL_URL');
    this.ucc_url = configService.get('UCC_URL');
    this.aof_url = configService.get('AOF_URL');
    this.payment_url = configService.get('PAYMENT_URL');
    this.enach_url = configService.get('ENACH_URL');
  }
  async register_mandate(object: any, encrypted_password) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };
      const paramAsString = object ? this.serializeParam(object) : null;
      // <soap:Header xmlns: wsa = "http://www.w3.org/2005/08/addressing" > <wsa: Action > http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</wsa:Action><wsa:To>https://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Secure</wsa:To></soap:Header>
      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://${this.bse_base}/2016/01/">
       
      <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://${this.bse_base}/2016/01/${this.bse_upload_service}/MFAPI</wsa:Action><wsa:To>${this.additional_url}</wsa:To></soap:Header>
        <soap:Body>
          <ns:MFAPI>
             <!--Optional:-->
             <ns:Flag>06</ns:Flag>
             <!--Optional:-->
             <ns:UserId>${this.user_id}</ns:UserId>
             <!--Optional:-->
             <ns:EncryptedPassword>${encrypted_password}</ns:EncryptedPassword>
             <!--Optional:-->
             <ns:param>${paramAsString}</ns:param>
          </ns:MFAPI>
        </soap:Body>
      </soap:Envelope>`;
      console.log('BBr', bodyRequest);

      // var response = this.httpService.post(`${this.bse_base_url}/MFUploadService/MFUploadService.svc/Secure`, bodyRequest, { headers: headersRequest }).pipe(
      const response = this.httpService
        .post(this.additional_url, bodyRequest, { headers: headersRequest })
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

  async order_status(object: any, encrypted_password) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };
      const paramAsString = object ? this.serializeParam(object) : null;
      // <soap:Header xmlns: wsa = "http://www.w3.org/2005/08/addressing" > <wsa: Action > http://bsestarmfdemo.bseindia.com/2016/01/IMFUploadService/MFAPI</wsa:Action><wsa:To>https://bsestarmfdemo.bseindia.com/MFUploadService/MFUploadService.svc/Secure</wsa:To></soap:Header>
      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://${this.bse_base}/2016/01/">
       
      <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://${this.bse_base}/2016/01/${this.bse_upload_service}/MFAPI</wsa:Action><wsa:To>${this.additional_url}</wsa:To></soap:Header>
        <soap:Body>
          <ns:MFAPI>
             <!--Optional:-->
             <ns:Flag>11</ns:Flag>
             <!--Optional:-->
             <ns:UserId>${this.user_id}</ns:UserId>
             <!--Optional:-->
             <ns:EncryptedPassword>${encrypted_password}</ns:EncryptedPassword>
             <!--Optional:-->
             <ns:param>${paramAsString}</ns:param>
          </ns:MFAPI>
        </soap:Body>
      </soap:Envelope>`;
      console.log('BBr', bodyRequest);

      // var response = this.httpService.post(`${this.bse_base_url}/MFUploadService/MFUploadService.svc/Secure`, bodyRequest, { headers: headersRequest }).pipe(
      const response = this.httpService
        .post(this.additional_url, bodyRequest, { headers: headersRequest })
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

  async bse_orders_purchase_redemption(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
      <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
      <wsa:Action>http://bsestarmf.in/MFOrderEntry/orderEntryParam</wsa:Action>
      <wsa:To>${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
      </soap:Header>
          <soap:Body>
          <bses:orderEntryParam>

              <bses:TransCode>${object.TransCode}</bses:TransCode>

              <bses:TransNo>${object.TransNo}</bses:TransNo>

              <bses:OrderId>${object.OrderId}</bses:OrderId>

              <bses:UserID>${object.UserID}</bses:UserID>

              <bses:MemberId>${object.MemberId}</bses:MemberId>

              <bses:ClientCode>${object.ClientCode}</bses:ClientCode>

              <bses:SchemeCd>${object.SchemeCd}</bses:SchemeCd>

              <bses:BuySell>${object.BuySell}</bses:BuySell>

              <bses:BuySellType>${object.BuySellType}</bses:BuySellType>

              <bses:DPTxn>${object.DPTxn}</bses:DPTxn>

              <bses:OrderVal>${object.OrderVal}</bses:OrderVal>

              <bses:Qty>${object.Qty}</bses:Qty>

              <bses:AllRedeem>${object.AllRedeem}</bses:AllRedeem>

              <bses:FolioNo>${object.FolioNo}</bses:FolioNo>

              <bses:Remarks>${object.Remarks}</bses:Remarks>

              <bses:KYCStatus>${object.KYCStatus}</bses:KYCStatus>

              <bses:RefNo>${object.RefNo}</bses:RefNo>

              <bses:SubBrCode>${object.SubBrCode}</bses:SubBrCode>

              <bses:EUIN>${object.EUIN}</bses:EUIN>

              <bses:EUINVal>${object.EUINVal}</bses:EUINVal>

              <bses:MinRedeem>${object.MinRedeem}</bses:MinRedeem>

              <bses:DPC>${object.DPC}</bses:DPC>

              <bses:IPAdd>${object.IPAdd}</bses:IPAdd>

              <bses:Password>${object.Password}</bses:Password>

              <bses:PassKey>${object.PassKey}</bses:PassKey>

              <bses:Parma1>${object.Parma1}</bses:Parma1>

              <bses:Param2>${object.Param2}</bses:Param2>

              <bses:Param3>${object.Param3}</bses:Param3>

              <bses:MobileNo>${object.MobileNo}</bses:MobileNo>

              <bses:EmailID>${object.EmailID}</bses:EmailID>

              <bses:MandateID>${object.MandateID}</bses:MandateID>

              <bses:Filler1>${object.Filler1}</bses:Filler1>

              <bses:Filler2>${object.Filler2}</bses:Filler2>

              <bses:Filler3>${object.Filler3}</bses:Filler3>

              <bses:Filler4>${object.Filler4}</bses:Filler4>

              <bses:Filler5>${object.Filler5}</bses:Filler5>

              <bses:Filler6>${object.Filler6}</bses:Filler6>
              
          </bses:orderEntryParam>
      </soap:Body>
  </soap:Envelope>`;
      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  async get_password_for_aof() {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:tem="http://tempuri.org/" 
xmlns:star="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">

   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
   <wsa:Action>http://tempuri.org/IStarMFFileUploadService/GetPassword</wsa:Action>
   <wsa:To>${this.bse_base_url}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To></soap:Header>
   <soap:Body>
      <tem:GetPassword>
         <!--Optional:-->
         <tem:Param>
            <!--Optional:-->
            <star:MemberId>${this.member_id}</star:MemberId>
            <!--Optional:-->
            <star:Password>${this.password}</star:Password>
            <!--Optional:-->
            <star:UserId>${this.user_id}</star:UserId>
         </tem:Param>
      </tem:GetPassword>
   </soap:Body>
</soap:Envelope>

`;
      console.log(
        'get_password_body',
        bodyRequest,
        `${this.bse_base_url}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure`,
      );

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  async aof_upload(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:tem="http://tempuri.org/" 
xmlns:bses="http://schemas.datacontract.org/2004/07/StarMFFileUploadService">
<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
<wsa:Action>http://tempuri.org/IStarMFFileUploadService/UploadFile</wsa:Action>
<wsa:To>${this.bse_base_url}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure</wsa:To>
</soap:Header>
 
    <soap:Body>
        <tem:UploadFile>
            <!--Optional:-->
            <tem:data>
            <!--Optional:-->
            <bses:ClientCode>${object.client_code}</bses:ClientCode>
            <!--Optional:-->
            <bses:DocumentType>NRM</bses:DocumentType>
            <!--Optional:-->
            <bses:EncryptedPassword>${object.encrypted_password}</bses:EncryptedPassword>
            <!--Optional:-->
            <bses:FileName>${object.filename}</bses:FileName>
            <!--Optional:-->
            <bses:Filler1></bses:Filler1>
            <!--Optional:-->
            <bses:Filler2></bses:Filler2>
            <!--Optional:-->
            <bses:Flag>UCC</bses:Flag>
            <!--Optional:-->
            <bses:MemberCode>${this.member_id}</bses:MemberCode>
            <!--Optional:-->
            <bses:UserId>${this.user_id}</bses:UserId>
            <!--Optional:-->
            <bses:pFileBytes>${object.file_buffer}</bses:pFileBytes>
            </tem:data>
        </tem:UploadFile>
   </soap:Body>
</soap:Envelope>`;

      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFFileUploadService/StarMFFileUploadService.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  async bse_order_xsip(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        SOAPAction: 'http://bsestarmf.in/MFOrderEntry/xsipOrderEntryParam',
        // "Authorization": `Bearer ${token.token.access_token}`
      };
      //       let bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
      // xmlns:bses="http://bsestarmf.in/"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:
      // Action>http://bsestarmf.in/MFOrderEntry/xsipOrderEntryParam</wsa:Action><wsa:To>https://bsestarmfdemo
      // .bseindia.com/MFOrderEntry/MFOrder.svc/Secure</wsa:To></soap:Header>
      //       <soap:Body><bses:xsipOrderEntryParam>
      //               <bses:TransactionCode>${object.TransactionCode}</bses:TransactionCode>
      //               <bses:UniqueRefNo>${object.UniqueRefNo}</bses:UniqueRefNo>
      //               <bses:SchemeCode>${object.SchemeCode}</bses:SchemeCode>
      //               <bses:MemberCode>${object.MemberCode}</bses:MemberCode>
      //               <bses:ClientCode>${object.ClientCode}</bses:ClientCode>
      //               <bses:UserID>${object.UserID}</bses:UserID>
      //               <bses:InternalRefNo>${object.InternalRefNo}</bses:InternalRefNo>
      //               <bses:TransMode>${object.TransMode}</bses:TransMode>
      //               <bses:DpTxnMode>${object.DpTxnMode}</bses:DpTxnMode>
      //               <bses:StartDate>${object.StartDate}</bses:StartDate>
      //               <bses:FrequencyType>${object.FrequencyType}</bses:FrequencyType>
      //               <bses:FrequencyAllowed>${object.FrequencyAllowed}</bses:FrequencyAllowed>
      //               <bses:InstallmentAmount>${object.InstallmentAmount}</bses:InstallmentAmount>
      //               <bses:NoOfInstallment>${object.NoOfInstallment}</bses:NoOfInstallment>
      //               <bses:Remarks>${object.Remarks}</bses:Remarks>
      //               <bses:FolioNo>${object.FolioNo}</bses:FolioNo>
      //               <bses:FirstOrderFlag>${object.FirstOrderFlag}</bses:FirstOrderFlag>
      //               <bses:Brokerage>${object.Brokerage}</bses:Brokerage>
      //               <bses:MandateID>${object.MandateID}</bses:MandateID>
      //               <bses:SubberCode>${object.SubberCode}</bses:SubberCode>
      //               <bses:Euin>${object.Euin}</bses:Euin>
      //               <bses:EuinVal>${object.EuinVal}</bses:EuinVal>
      //               <bses:DPC>${object.DPC}</bses:DPC>
      //               <bses:XsipRegID>${object.XsipRegID}</bses:XsipRegID>
      //               <bses:IPAdd>${object.IPAdd}</bses:IPAdd>
      //               <bses:Password>${object.Password}</bses:Password>
      //               <bses:PassKey>${object.PassKey}</bses:PassKey>
      //               <bses:Param1>${object.Param1}</bses:Param1>
      //               <bses:Param2>${object.Param2}</bses:Param2>
      //               <bses:Param3>${object.Param3}</bses:Param3>
      //               <bses:Filler1>${object.Filler1}</bses:Filler1>
      //               <bses:Filler2>${object.Filler2}</bses:Filler2>
      //               <bses:Filler3>${object.Filler3}</bses:Filler3>
      //               <bses:Filler4>${object.Filler4}</bses:Filler4>
      //               <bses:Filler5>${object.Filler5}</bses:Filler5>
      //               <bses:Filler6>${object.Filler6}</bses:Filler6>
      //       </bses:xsipOrderEntryParam></soap:Body>
      // </soap:Envelope>
      // `

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://bsestarmf.in/MFOrderEntry/xsipOrderEntryParam</wsa:Action><wsa:To>${this.order_url}/MFOrderEntry/MFOrder.svc/Secure</wsa:To></soap:Header>
    <soap:Body><bses:xsipOrderEntryParam>
         <!--Optional:-->
         <bses:TransactionCode>${object.TransactionCode}</bses:TransactionCode>
         <!--Optional:-->
         <bses:UniqueRefNo>${object.UniqueRefNo}</bses:UniqueRefNo>
         <!--Optional:-->
         <bses:SchemeCode>${object.SchemeCode}</bses:SchemeCode>
         <!--Optional:-->
         <bses:MemberCode>${object.MemberCode}</bses:MemberCode>
         <!--Optional:-->
         <bses:ClientCode>${object.ClientCode}</bses:ClientCode>
         <!--Optional:-->
         <bses:UserId>${object.UserID}</bses:UserId>
         <!--Optional:-->
         <bses:InternalRefNo>${object.InternalRefNo}</bses:InternalRefNo>
         <!--Optional:-->
         <bses:TransMode>${object.TransMode}</bses:TransMode>
         <!--Optional:-->
         <bses:DpTxnMode>${object.DpTxnMode}</bses:DpTxnMode>
         <!--Optional:-->
         <bses:StartDate>${object.StartDate}</bses:StartDate>
         <!--Optional:-->
         <bses:FrequencyType>${object.FrequencyType}</bses:FrequencyType>
         <!--Optional:-->
         <bses:FrequencyAllowed>${object.FrequencyAllowed}</bses:FrequencyAllowed>
         <!--Optional:-->
         <bses:InstallmentAmount>${object.InstallmentAmount}</bses:InstallmentAmount>
         <!--Optional:-->
         <bses:NoOfInstallment>${object.NoOfInstallment}</bses:NoOfInstallment>
         <!--Optional:-->
         <bses:Remarks>${object.Remarks}</bses:Remarks>
         <!--Optional:-->
         <bses:FolioNo>${object.FolioNo}</bses:FolioNo>
         <!--Optional:-->
         <bses:FirstOrderFlag>${object.FirstOrderFlag}</bses:FirstOrderFlag>
         <!--Optional:-->
         <bses:Brokerage>${object.Brokerage}</bses:Brokerage>
         <!--Optional:-->
         <bses:MandateID>${object.MandateID}</bses:MandateID>
         <!--Optional:-->
         <bses:SubberCode>${object.SubberCode}</bses:SubberCode>
         <!--Optional:-->
         <bses:Euin>${object.Euin}</bses:Euin>
         <!--Optional:-->
         <bses:EuinVal>${object.EuinVal}</bses:EuinVal>
         <!--Optional:-->
         <bses:DPC>${object.DPC}</bses:DPC>
         <!--Optional:-->
         <bses:XsipRegID>${object.XsipRegID}</bses:XsipRegID>
         <!--Optional:-->
         <bses:IPAdd>${object.IPAdd}</bses:IPAdd>
         <!--Optional:-->
         <bses:Password>${object.Password}</bses:Password>
         <!--Optional:-->
         <bses:PassKey>${object.PassKey}</bses:PassKey>
         <!--Optional:-->
         <bses:Param1>${object.Param1}</bses:Param1>
         <!--Optional:-->
         <bses:Param2>${object.Param2}</bses:Param2>
         <!--Optional:-->
         <bses:Param3>${object.Param3}</bses:Param3>
          <!--Optional:-->
         <bses:Filler1>${object.Filler1}</bses:Filler1>
         <!--Optional:-->
         <bses:Filler2>${object.Filler2}</bses:Filler2>
         <!--Optional:-->
         <bses:Filler3>${object.Filler3}</bses:Filler3>
         <!--Optional:-->
         <bses:Filler4>${object.Filler4}</bses:Filler4>
         <!--Optional:-->
         <bses:Filler5>${object.Filler5}</bses:Filler5>
         <!--Optional:-->
         <bses:Filler6>${object.Filler6}</bses:Filler6>
      </bses:xsipOrderEntryParam>
   </soap:Body>
</soap:Envelope>`;

      console.log('Body of order xsip', bodyRequest);
      //       const soapBodySingleLine = bodyRequest.replace(/\s+/g, ' ').trim();
      // console.log("soapBodySingleLine", soapBodySingleLine);
      const response = this.httpService
        .post(
          `${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
        .pipe(
          map((resp) => {
            console.log('FRESPONSEP ' + resp);
            return resp.data;
          }),
        )
        .pipe(
          catchError((e) => {
            console.log('error in request', e.response?.data || e.message);
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

  async bse_order_switch(object: any) {
    try {
      const headersRequest = {
        'Content-Type': 'application/soap+xml',
      };

      // let bodyRequest = `soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"   xmlns:bses="http://bsestarmf.in/">
      // <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://bsestarmf.in/  MFOrderEntry/switchOrderEntryParam</wsa:Action><wsa:To>https://bsestarmfdemo.bseindia.com/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
      //         </soap:Header>
      //         <soap:Body><bses:switchOrderEntryParam>
      //         <bses:TransCode>${object.Transactioncode}</bses:TransCode>
      //         <bses:TransNo>${object.UniqueRefNo}</bses:TransNo>
      //         <bses:OrderId>${object.OrderId}</bses:OrderId>
      //         <bses:UserID>${object.UserID}</bses:UserID>
      //         <bses:MemberId>${object.MemberCode}</bses:MemberId>
      //         <bses:ClientCode>${object.ClientCode}</bses:ClientCode>
      //         <bses:FromSchemeCd>${object.FromSchemeCode}</bses:FromSchemeCd>
      //         <bses:ToSchemeCd>${object.ToSchemeCode}</bses:ToSchemeCd>
      //         <bses:BuySell>${object.Buysell}</bses:BuySell>
      //         <bses:BuySellType>${object.Buyselltype}</bses:BuySellType>
      //         <bses:DPTxn>${object.DpTxnMode}</bses:DPTxn>
      //         <bses:OrderVal></bses:OrderVal>
      //         <bses:SwitchUnits>${object.SwitchUnits}</bses:SwitchUnits>
      //         <bses:AllUnitsFlag>${object.AllUnitsFlag}</bses:AllUnitsFlag>
      //         <bses:FolioNo>${object.FolioNo}</bses:FolioNo>
      //         <bses:Remarks>${object.Remarks}</bses:Remarks>
      //         <bses:KYCStatus>${object.KycStatus}</bses:KYCStatus>
      //         <bses:SubBrCode>${object.SubbrCode}</bses:SubBrCode>
      //         <bses:EUIN>${object.Euin}</bses:EUIN>
      //         <bses:EUINVal>${object.EuinVal}</bses:EUINVal>
      //         <bses:MinRedeem>${object.MinRedeem}</bses:MinRedeem>
      //         <bses:IPAdd>${object.IPAddress}</bses:IPAdd>
      //         <bses:Password>${object.Password}</bses:Password>
      //         <bses:PassKey>${object.PassKey}</bses:PassKey>
      //         <bses:Parma1>${object.Param1}</bses:Parma1>
      //         <bses:Param2>${object.Param2}</bses:Param2>
      //         <bses:Param3>${object.Param3}</bses:Param3>
      //         <bses:Filler1>${object.Filler1}</bses:Filler1>
      //         <bses:Filler2>${object.Filler2}</bses:Filler2>
      //         <bses:Filler3>${object.Filler3}</bses:Filler3>
      //         <bses:Filler4>${object.Filler4}</bses:Filler4>
      //         <bses:Filler5>${object.Filler5}</bses:Filler5>
      //         <bses:Filler6>${object.Filler6}</bses:Filler6>
      //        </bses:switchOrderEntryParam></soap:Body>
      // </soap:Envelope>`

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:bses="http://bsestarmf.in/">
   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
   <wsa:Action>http://bsestarmf.in/MFOrderEntry/switchOrderEntryParam</wsa:Action>
   <wsa:To>${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
   </soap:Header>
   <soap:Body>
      <bses:switchOrderEntryParam>
         <!--Optional:-->
         <bses:TransCode>${object.Transactioncode}</bses:TransCode>
         <!--Optional:-->
         <bses:TransNo>${object.UniqueRefNo}</bses:TransNo>
         <!--Optional:-->
         <bses:OrderId>${object.OrderId}</bses:OrderId>
         <!--Optional:-->
         <bses:UserId>${object.UserID}</bses:UserId>
         <!--Optional:-->
         <bses:MemberId>${object.MemberCode}</bses:MemberId>
         <!--Optional:-->
         <bses:ClientCode>${object.ClientCode}</bses:ClientCode>
         <!--Optional:-->
         <bses:FromSchemeCd>${object.FromSchemeCode}</bses:FromSchemeCd>
         <!--Optional:-->
         <bses:ToSchemeCd>${object.ToSchemeCode}</bses:ToSchemeCd>	
         <!--Optional:-->
         <bses:BuySell>${object.Buysell}</bses:BuySell>
         <!--Optional:-->
         <bses:BuySellType>${object.Buyselltype}</bses:BuySellType>
         <!--Optional:-->
         <bses:DPTxn>${object.DpTxnMode}</bses:DPTxn>
         <!--Optional:-->
         <bses:OrderVal></bses:OrderVal>
         <!--Optional:-->
         <bses:SwitchUnits>${object.SwitchUnits}</bses:SwitchUnits>
         <!--Optional:-->
         <bses:AllUnitsFlag>${object.AllUnitsFlag}</bses:AllUnitsFlag>
         <!--Optional:-->
         <bses:FolioNo>${object.FolioNo}</bses:FolioNo>
         <!--Optional:-->
         <bses:Remarks>${object.Remarks}</bses:Remarks>
         <!--Optional:-->
         <bses:KYCStatus>${object.KycStatus}</bses:KYCStatus>
         <!--Optional:-->
         <bses:SubBrCode>${object.SubbrCode}</bses:SubBrCode>
         <!--Optional:-->
         <bses:EUIN>${object.Euin}</bses:EUIN>
         <!--Optional:-->
         <bses:EUINVal>${object.EuinVal}</bses:EUINVal>
         <!--Optional:-->
         <bses:MinRedeem>${object.MinRedeem}</bses:MinRedeem>
         <!--Optional:-->
         <bses:IPAdd>${object.IPAddress}</bses:IPAdd>
         <!--Optional:-->
         <bses:Password>${object.Password}</bses:Password>
         <!--Optional:-->
         <bses:PassKey>${object.PassKey}</bses:PassKey>
         <!--Optional:-->
         <bses:Parma1>${object.Param1}</bses:Parma1>
         <!--Optional:-->
         <bses:Param2>${object.Param2}</bses:Param2>
         <!--Optional:-->
         <bses:Param3>${object.Param3}</bses:Param3>
         <!--Optional:-->
          <bses:Filler1>${object.Filler1}</bses:Filler1>
         <!--Optional:-->
         <bses:Filler2>${object.Filler2}</bses:Filler2>
         <!--Optional:-->
         <bses:Filler3>${object.Filler3}</bses:Filler3>
         <!--Optional:-->
          <bses:Filler4>${object.Filler4}</bses:Filler4>
         <!--Optional:-->
         <bses:Filler5>${object.Filler5}</bses:Filler5>
         <!--Optional:-->
         <bses:Filler6>${object.Filler6}</bses:Filler6>
      </bses:switchOrderEntryParam>
   </soap:Body>
</soap:Envelope>`;
      console.log('Body of order switch', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  async register_xsip(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        APIKEY: 'VmxST1UyRkhUbkpOVldNOQ==',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        LoginId: object.login_id,
        MemberCode: object.member_id,
        Password: object.password,
        SchemeCode: object.scheme_code,
        ClientCode: object.client_code,
        IntRefNo: object.internal_ref_no,
        TransMode: object.trans_mode,
        DPTransMode: object.dp_trans_mode,
        StartDate: object.start_date,
        FrequencyType: object.frequency_type,
        FrequencyAllowed: object.frequency_allowed,
        InstAmount: object.installment_amount,
        NoOfInst: object.no_of_installemnts,
        Remarks: object.remarks,
        FolioNo: object.folio_no,
        FirstOrderFlag: object.first_order_flag,
        SubBrCode: object.sub_br_code,
        EUIN: object.euin,
        EUINFlag: object.euin_declaration_flag,
        DPC: object.dpc,
        SubBrokerARN: object.sub_broker_arn,
        EndDate: object.end_date,
        RegnType: object.registration_type,
        Brokerage: object.brokerage,
        MandateId: object.mandate_id,
        XSIPType: object.xsip_type,
        TargetScheme: object.target_scheme,
        TargetAmount: object.target_amount,
        GoalType: object.goal_type,
        GoalAmount: object.goal_amount,
        Filler1: object.filler_1,
        Filler2: object.filler_2,
        Filler3: object.filler_3,
        Filler4: object.filler_4,
        Filler5: object.filler_5,
        Filler6: object.filler_6,
        Filler7: object.filler_7,
        Filler8: object.filler_8,
        Filler9: object.filler_9,
        Filler10: object.filler_10,
      };
      console.log('reg_xsip_body', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFAPI/api/XSIP/XSIPRegistration`,
          bodyRequest,
          { headers: headersRequest },
        )
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

            throw new ForbiddenException(e.response?.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async register_swp(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:ns="http://${this.bse_base}/2016/01/">
<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
<wsa:Action>http://${this.bse_base}/2016/01/${this.bse_upload_service}/MFAPI</wsa:Action>
<wsa:To>${this.additional_url}</wsa:To>
</soap:Header>
<soap:Body>
<ns:MFAPI>
	<!--Optional:-->
	<ns:Flag>08</ns:Flag>
	<!--Optional:-->
	<ns:UserId>${this.user_id}</ns:UserId>
	<!--Optional:-->
	<ns:EncryptedPassword>${object.encrypted_password}</ns:EncryptedPassword>
	<!--Optional:-->
	<ns:param>${object.client_code}|${object.bse_scheme_code}|${object.transaction_mode}|${object.folio_no}|${object.internal_ref_no}|${object.start_date}|${object.no_of_withdrawls}|${object.frequency_type}|${object.installment_amount}|${object.installment_units}|${object.first_order_today}|${object.sub_br_code}|${object.euin_declaration_flag}|${object.euin}|${object.remarks}|${object.sub_broker_arn}|${object.mobile_no}|${object.email}|${object.bank_account_no}</ns:param>
	</ns:MFAPI></soap:Body>
</soap:Envelope>`;
      console.log('Body of order purchase', bodyRequest);

      const response = this.httpService
        .post(this.additional_url, bodyRequest, { headers: headersRequest })
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

  async register_stp(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        APIKEY: 'VmxST1UyRkhUbkpOVldNOQ==',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        LoginId: object.login_id,
        MemberCode: object.member_id,
        Password: object.password,
        TransType: object.transaction_type,
        STPType: object.stp_type,
        ClientCode: object.client_code,
        FromBSESchemeCode: object.from_bse_scheme_code,
        ToBSESchemeCode: object.to_bse_scheme_code,
        BuySellType: object.buy_sell_type,
        TransactionMode: object.transaction_mode,
        FolioNo: object.folio_no,
        STPRegNo: object.stp_registration_no,
        IntRefNo: object.internal_ref_no,
        StartDate: object.start_date,
        FrequencyType: object.frequency_type,
        NoOfTransfers: object.no_of_transfers,
        InstAmount: object.installment_amount,
        InstUnit: object.units,
        FirstOrderToday: object.first_order_flag,
        SubBrokerCode: object.sub_br_code,
        EUINDeclaration: object.euin_declaration_flag,
        EUINNumber: object.euin,
        Remarks: object.remarks,
        EndDate: object.end_date,
        SubBrokerARN: object.sub_broker_arn,
        Filler1: object.filler_1,
        Filler2: object.filler_2,
        Filler3: object.filler_3,
        Filler4: object.filler_4,
        Filler5: object.filler_5,
      };
      console.log('reg_stp_body', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/starmfapi/api/stp/stpregistration`,
          bodyRequest,
          { headers: headersRequest },
        )
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
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_password_for_registration(tenant_id) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"  
xmlns:ns="http://${this.bse_base}/2016/01/">

   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
   <wsa:Action>http://${this.bse_base}/2016/01/${this.bse_upload_service}/getPassword</wsa:Action>
   <wsa:To>${this.additional_url}</wsa:To>
   </soap:Header>
   
   <soap:Body>
      <ns:getPassword>
         <!--Optional:-->
         <ns:UserId>${this.user_id}</ns:UserId>
         <!--Optional:-->
         <ns:MemberId>${this.member_id}</ns:MemberId>
         <!--Optional:-->
         <ns:Password>${this.password}</ns:Password>
         <!--Optional:-->
         <ns:PassKey>${tenant_id}</ns:PassKey>
      </ns:getPassword>
   </soap:Body>
</soap:Envelope>

`;
      console.log(
        'get_password_body',
        bodyRequest,
        `${this.bse_base_url}/MFUploadService/MFUploadService.svc/Secure`,
        'URLLLLL',
        this.additional_url,
      );

      const response = this.httpService
        .post(this.additional_url, bodyRequest, { headers: headersRequest })
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
  async get_password() {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/soap+xml',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" 
xmlns:bses="http://bsestarmf.in/">

   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
   
   <wsa:Action>http://bsestarmf.in/MFOrderEntry/getPassword</wsa:Action>
   <wsa:To>${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure</wsa:To>
   
   </soap:Header>
   <soap:Body>
      <bses:getPassword>
         <!--Optional:-->
         <bses:UserId>${this.user_id}</bses:UserId>
         <!--Optional:-->
         <bses:Password>${this.password}</bses:Password>
         <!--Optional:-->
         <bses:PassKey>${this.password}</bses:PassKey>
      </bses:getPassword>
   </soap:Body>
</soap:Envelope>
`;
      console.log(
        'get_password_body for registration',
        bodyRequest,
        `${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure`,
      );

      const response = this.httpService
        .post(
          `${this.bse_base_url}/MFOrderEntry/MFOrder.svc/Secure`,
          bodyRequest,
          { headers: headersRequest },
        )
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

  serializeParam(param: any): string {
    return Object.values(param).join('|'); // Joins all values with a pipe ('|')
  }

  async add_ucc(body: any) {
    try {
      // let token: any = await this.access_token()
      // console.log("took", token.token.access_token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
      };
      const paramAsString = body ? this.serializeParam(body) : null;
      const bodyRequest = {
        UserId: this.user_id,
        MemberCode: this.member_id,
        Password: this.password,
        RegnType: 'NEW',
        Param: paramAsString,
        Filler1: '',
        Filler2: '',
      };

      console.log('BRD', bodyRequest);
      // let stringbody=JSON.stringify(bodyRequest)
      // let json_body=JSON.parse(stringbody)

      // console.log("BR1D",stringbody)
      // console.log("B2RD",json_body)

      const response = this.httpService
        .post(
          this.bse_base_url + '/BSEMFWEBAPI/UCCAPI/UCCRegistration',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('UCC', result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      console.log('errorr', e);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async add_ucc_v2(body: any) {
    try {
      // let token: any = await this.access_token()
      // console.log("took", token.token.access_token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
      };
      const paramAsString = body ? this.serializeParam(body) : null;
      const bodyRequest = {
        UserId: this.user_id,
        MemberCode: this.member_id,
        Password: this.password,
        RegnType: 'NEW',
        Param: paramAsString,
        Filler1: '',
        Filler2: '',
      };

      console.log('BRD', bodyRequest);
      // let stringbody=JSON.stringify(bodyRequest)
      // let json_body=JSON.parse(stringbody)

      // console.log("BR1D",stringbody)
      // console.log("B2RD",json_body)
      // https://bsestarmfdemo.bseindia.com/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183
      const response = this.httpService
        .post(
          this.bse_base_url + '/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('UCC', result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      console.log('errorr', e);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async fatca(body: any, encryptedPassword) {
    try {
      // let token: any = await this.access_token()
      // console.log("took", token.token.access_token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/soap+xml',
      };
      const paramAsString = body ? this.serializeParam(body) : null;
      const bodyRequest =
        // {
        //   "UserId": "5961101",
        //   "MemberCode": "59611",
        //   "Password": "Bse@1234",
        //   "RegnType": "NEW",
        //   "Param": paramAsString,
        //   "Filler1": "",
        //   "Filler2": ""
        // }
        `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://${this.bse_base}/2016/01/">
   <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:Action>http://${this.bse_base}/2016/01/${this.bse_upload_service}/MFAPI</wsa:Action><wsa:To>${this.additional_url}</wsa:To></soap:Header>
   <soap:Body>
      <ns:MFAPI>
         <!--Optional:-->
         <ns:Flag>01</ns:Flag>
         <!--Optional:-->
         <ns:UserId>${this.user_id}</ns:UserId>
         <!--Optional:-->
         <ns:EncryptedPassword>${encryptedPassword}</ns:EncryptedPassword>
         <!--Optional:-->
         <ns:param>${paramAsString}</ns:param>
      </ns:MFAPI>
   </soap:Body>
</soap:Envelope>
`;

      console.log('BRD', bodyRequest);
      // let stringbody=JSON.stringify(bodyRequest)
      // let json_body=JSON.parse(stringbody)

      // console.log("BR1D",stringbody)
      // console.log("B2RD",json_body)

      const response = this.httpService
        .post(this.additional_url, bodyRequest, { headers: headersRequest })
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (e) {
      console.log('errorr', e);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async paymentGateway(body: any) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/json',
      };

      const response = this.httpService
        .post(
          this.bse_base_url + '/StarMFSinglePaymentAPI/Single/Payment',
          body,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('errorr', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async updatebank(body: any) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/json',
      };
      const bodyRequest = {
        login_id: this.user_id,
        member_id: this.member_id,
        password: this.password,
        req_type: 'BANK_MOD',
        int_ref_no: '',
        ucc_req: [body],
      };
      console.log('Bank', bodyRequest);
      const response = this.httpService
        .post(
          this.bse_base_url +
            '/BankAccountModification/api/UCC/BankModification/w',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('errorr', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  // async updatenominee(body: any) {
  //   try {
  //     const headersRequest = {
  //       // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
  //       // "Authorization": `Bearer ${token.token.access_token}`
  //       "Content-Type": "application/json"
  //     }
  //     let bodyRequest = {
  //       "Type": "NOMINEE",
  //       "UserId": this.user_id,
  //       "MemberCode": this.member_id,
  //       "Password": this.password,
  //       "RegnType": "MOD",
  //       "FILLER1": "",
  //       "FILLER2": "",
  //       "FILLER3": "",
  //       "Param": [body]
  //     }
  //     var response = this.httpService.post(this.bse_base_url + '/BSEMFWEBAPI/api/mfupload/Registation/w', body, { headers: headersRequest }).pipe(
  //       map((resp) => {
  //         console.log("FRESPONSEP " + resp);
  //         return resp.data;
  //       }),
  //     ).pipe(
  //       catchError((e) => {
  //         console.log("error in fp auth ", e);
  //         if (e.response && e.response.data && e.response.data.error) {
  //           console.log("Les", e.response.data.error);
  //           e.response.data.error.message = "";
  //           e.response.data.error.errors.map((er) => { e.response.data.error.message += er.field + " : " + er.message + ". " });

  //         }
  //         // throw new ForbiddenException();
  //         throw new ForbiddenException(e.response.data.error, e.message);
  //       }),
  //     );

  //     var result = await lastValueFrom(response);
  //     console.log(result);
  //     return { status: HttpStatus.OK, ...result };
  //   }
  //   catch (err) {
  //     console.log("errorr", err)
  //     return { status: HttpStatus.BAD_REQUEST, error: "Could not fetch FP Token" };
  //   }
  // }

  async enachAuthUrl(client_code: string, mandate_id: string, url: string) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/json',
      };
      const bodyRequest = {
        MemberCode: this.member_id,
        Password: this.password,
        ClientCode: client_code,
        UserId: this.user_id,
        MandateID: mandate_id,
        LoopBackUrl: url,
      };
      console.log('body', bodyRequest);

      const response = this.httpService
        .post(
          this.bse_base_url +
            '/StarMFWebService/StarMFWebService.svc/EMandateAuthURL',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('errorr', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async password_child() {
    try {
      const body = {
        MemberId: this.member_id,
        PassKey: this.password,
        Password: this.password,
        RequestType: 'CHILDORDER',
        UserId: this.user_id,
      };
      const res = await this.child_order_password(body);
      console.log('password_res', res);
      return { status: HttpStatus.OK, data: res };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async child_order_password(object: any) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
      };

      const bodyRequest = {
        MemberId: object.MemberId,
        PassKey: object.PassKey,
        Password: object.Password,
        RequestType: object.RequestType,
        UserId: object.UserId,
      };
      console.log('childOrder_body', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFWebService/StarMFWebService.svc/GetPasswordForChildOrder`,
          bodyRequest,
          { headers: headersRequest },
        )
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
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async child_order_request(object: any) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
      };

      const bodyRequest = {
        ClientCode: object.ClientCode,
        Date: object.Date,
        EncryptedPassword: object.EncryptedPassword,
        MemberCode: object.MemberCode,
        RegnNo: object.RegnNo,
        SystematicPlanType: object.SystematicPlanType,
      };
      console.log('childOrder_req', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFWebService/StarMFWebService.svc/ChildOrderDetails`,
          bodyRequest,
          { headers: headersRequest },
        )
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
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async cancelXsip(object: any) {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
        APIKEY: 'VmxST1UyRkhUbkpOVldNOQ==',
      };

      const bodyRequest = {
        LoginId: this.user_id,
        MemberCode: this.member_id,
        Password: this.password,
        ClientCode: object.client_code,
        RegnNo: object.regn_no,
        IntRefNo: '',
        CeaseBseCode: object.cancel_code,
        Remarks: object.reason,
      };
      console.log('childOrder_req', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/StarMFAPI/api/XSIP/XSIPCancellation`,
          bodyRequest,
          { headers: headersRequest },
        )
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
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async mandateAccesstoken() {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/json',
      };
      const bodyRequest = {
        RequestType: 'MANDATE',
        UserId: this.user_id,
        MemberId: this.member_id,
        Password: this.password,
        PassKey: this.password,
      };
      console.log('body', bodyRequest);

      const response = this.httpService
        .post(
          this.bse_base_url +
            '/StarMFWebService/StarMFWebService.svc/GetAccessToken',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('errorr', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async mandateStatus(
    client_code: string,
    mandate_id: string,
    password: string,
  ) {
    try {
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        // "Authorization": `Bearer ${token.token.access_token}`
        'Content-Type': 'application/json',
      };
      const bodyRequest = {
        ClientCode: client_code,
        EncryptedPassword: password,
        FromDate: '26/07/2024',
        MandateId: mandate_id,
        MemberCode: this.member_id,
        ToDate: getCurrentDate(),
      };
      console.log('body', bodyRequest);

      const response = this.httpService
        .post(
          this.bse_base_url +
            '/StarMFWebService/StarMFWebService.svc/MandateDetails',
          bodyRequest,
          { headers: headersRequest },
        )
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
            // throw new ForbiddenException();
            throw new ForbiddenException(e.response.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log(result);
      return { status: HttpStatus.OK, ...result };
    } catch (err) {
      console.log('errorr', err);
      return {
        status: HttpStatus.BAD_REQUEST,
        error: 'Could not fetch FP Token',
      };
    }
  }

  async update_nominee(object: any) {
    try {
      // let token: any = await this.access_token();
      // console.log("token", token)
      const headersRequest = {
        // "X-STARMFv2-Trace-ID": "ae150a56 - a554 - 4679 - a124-024b8dafe9bc",
        'Content-Type': 'application/json',
        APIKEY: 'VmxST1UyRkhUbkpOVldNOQ==',
        // "Authorization": `Bearer ${token.token.access_token}`
      };

      const bodyRequest = {
        Type: 'NOMINEE',
        UserId: this.user_id,
        MemberCode: this.member_id,
        Password: this.password,
        RegnType: 'MOD',
        FILLER1: '',
        FILLER2: '',
        FILLER3: '',
        Param: [object],
      };
      console.log('reg_xsip_body', bodyRequest);

      const response = this.httpService
        .post(
          `${this.bse_base_url}/BSEMFWEBAPI/api/mfupload/RegistationV56/w`,
          bodyRequest,
          { headers: headersRequest },
        )
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

            throw new ForbiddenException(e.response?.data.error, e.message);
          }),
        );

      const result = await lastValueFrom(response);
      console.log('resultttt', result);
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      console.log('error', err);
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  findAll() {
    return `This action returns all bsev1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bsev1`;
  }

  update(id: number, updateBsev1Dto: UpdateBsev1Dto) {
    return `This action updates a #${id} bsev1`;
  }

  remove(id: number) {
    return `This action removes a #${id} bsev1`;
  }
}

function getCurrentDate(): string {
  const today: Date = new Date();
  const dd: string = String(today.getDate()).padStart(2, '0');
  const mm: string = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const yyyy: number = today.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
