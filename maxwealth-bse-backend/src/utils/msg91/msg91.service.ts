// import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { AxiosResponse } from 'axios';
// import { ConfigService } from '@nestjs/config';
// import { catchError, lastValueFrom, map } from 'rxjs';

// @Injectable()
// export class Msg91Service {
//   private baseUrl = 'https://control.msg91.com/api/v5';
//   private authKey:string;
//   private authFbToken:string;
//   private whatsappNumber:string;
//   private whatsappBaseUrl:string;
//   private whatsappNumberId:string;

//   constructor(private httpService: HttpService) {
//     const configService = new ConfigService();
//     this.authKey = configService.get("MSG_APIKEY");
//     this.whatsappNumber = configService.get("WHATSAPP_NUMBER");
//     this.whatsappBaseUrl = configService.get("FB_WHATSAPP_BASE_URL");
//     this.whatsappNumberId = configService.get("FB_WHATSAPP_NO_ID");
//     this.authFbToken = configService.get("FB_WHATSAPP_TOKEN");
//   }

//   async sendEmail(templateId,recipient,variables) {
//     //{ name: '', email: 'Recipient1 email' }
//       const recipients =[recipient];
//       const from = {   "email": "no-reply@maxwealth.money"};
//       const domain = 'maxwealth.money';

//     //   const attachments = [
//     //     { filePath: 'Public path for file.', fileName: 'File Name' },
//     //     {
//     //       file: 'File in Data URI format data:content/type;base64,<data>.',
//     //       fileName   : 'File Name',
//     //     },
//     //   ];

//     try {
//       const response = await this.httpService.post(
//         `${this.baseUrl}/email/send`,
//         {
//           to:recipients,
//           from:from,
//           domain:domain,
//         //   reply_to: replyTo,
//           variables: variables,
//           mail_type_id:1,

//           template_id: templateId,
//         },
//         {
//           headers: {
//             'Authkey': this.authKey,
//             "accept": "application/json",
//             "content-type": "application/json"
//           },
//         },
//       ).pipe(
//         map((resp) => {
//             console.log("FP RESPONSE" + resp);
//             console.log("FP RESPONSE" + resp.data);

//             return resp.data;
//         }),
//     ).pipe(
//         catchError((e) => {
//             console.log(e.response);

//             if(e.response && e.response.data && e.response.data.errors){
//                 console.log(e.response.data.errors);
//                 e.response.data.message = "";
//                 // e.response.data.errors.map((er)=> { e.response.data.message += er.field + " : " +  er.message + ", " });
//                 // console.log("ERRORS", e.response.data.errors);
//                 console.log("ERRORS",  e.response.data.message);

//             }

//             throw new ForbiddenException(e.response.data.errors, e.message);
//         }),
//     );

//     var result = await lastValueFrom(response);
//     console.log("POST RESPONSE RESULT ",result);
//     return {status: HttpStatus.OK, data:result};

//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }

//   /*

//   vaiables
//   [
//               {
//                 "type": "text",
//                 "text": "testing it"
//               },
//               {
//                 "type": "text",
//                 "text": "testing it"
//               },
//               {
//                 "type": "text",
//                 "text": "text"
//               },
//               {
//                 "type": "text",
//                 "text": "text"
//               }
//   ]
// */
//  async sendWhatsapp(to_number:string,templateId:string,variables:any) {

//   try {
//     console.log("whatsapp start");

//     let url = this.whatsappBaseUrl + "/" + this.whatsappNumberId + "/messages";

//     let body = {
//       "messaging_product": "whatsapp",
//        "recipient_type": "individual",
//       "to": "+91" + to_number,
//       "type": "template",
//       "template": {
//         "name": templateId,
//         "language": {
//           "code": "en"
//         },
//         "components": [

//           {
//             "type": "body",
//             "parameters": variables
//           }
//         ]
//       }
//     };
//   console.log("whatsapp start 2");

//   const response = await this.httpService.post(url,
//     body,
//     {
//       headers: {
//         'Authorization': "Bearer " + this.authFbToken,
//         "accept": "application/json",
//         "content-type": "application/json"
//       },
//     },

//   ).pipe(
//     map((resp) => {
//         console.log("whatapp RESPONSE" + resp);
//         console.log("whatapp RESPONSE 2" + resp.data);

//         return resp.data;
//     }),
// ).pipe(
//     catchError((e) => {
//       console.log("exception",e);
//         console.log("exception 2",e.response);

//         if(e.response && e.response.data && e.response.data.errors){
//             console.log(e.response.data.errors);
//             e.response.data.message = "";
//             // e.response.data.errors.map((er)=> { e.response.data.message += er.field + " : " +  er.message + ", " });
//             // console.log("ERRORS", e.response.data.errors);
//             console.log("ERRORS",  e.response);

//         }
//         console.log("ERRORS",  e.response.data.error.error_data);

//         throw new ForbiddenException(e.response.data.errors, e.message);
//     }),
// );

// var result = await lastValueFrom(response);
// console.log("POST RESPONSE RESULT ",result);
// return {status: HttpStatus.OK, data:result};
//   }
// catch (error) {
//   console.error(error);
//   throw error;
// }

//  }

// }
