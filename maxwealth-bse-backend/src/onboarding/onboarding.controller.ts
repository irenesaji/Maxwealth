import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  HttpStatus,
  ParseFilePipe,
  Post,
  Query,
  Render,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckKycDto } from './dtos/check-kyc.dto';
import { OnboardingService } from './onboarding.service';
import { Response, Request } from 'express';
import { ConfirmPanDetailsDto } from './dtos/confirm-pan-details.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AddPersonalDetailsDto } from './dtos/add-personal-details.dto';
import { AddOccupationDetailsDto } from './dtos/add-occupation-details.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { extension } from 'mime-types';
import { AddGeoTagDto } from './dtos/add-geo-tag.dto';
import { AddAadhaarNumberDto } from './dtos/add-aadhaar-number.dto';

@Controller('api/')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/check_kyc')
  async check_kyc(@Body() checkKycDto: CheckKycDto, @Res() res: Response) {
    try {
      const result = await this.onboardingService.check_kyc(checkKycDto);
      console.log('res', result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/confirm_pan_details')
  async confirm_pan_details(
    @Body() confirmPanDetailsDto: ConfirmPanDetailsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.confirm_pan_details(
        confirmPanDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/confirm_pan_details')
  async get_confirm_pan_details(
    @Headers() headers,
    @Query('user_id') user_id: number,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.get_confirm_pan_details(
        user_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_personal_details')
  async add_personal_details(
    @Body() addPersonalDetailsDto: AddPersonalDetailsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.add_personal_details(
        addPersonalDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_personal_details')
  async get_personal_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.get_personal_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_onboarding_details')
  async get_onboarding_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.get_onboarding_details(
        user_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_occupation_details')
  async add_occupation_details(
    @Body() addOccupationDetailsDto: AddOccupationDetailsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.add_occupation_details(
        addOccupationDetailsDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_occupation_details')
  async get_occupation_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.get_occupation_details(
        user_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photo',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          console.log('FILE DETAILS : ', file);
          const extArray = file.mimetype.split('/');
          const exten = extArray[extArray.length - 1];
          return cb(null, `${randomName}.${exten}`);
        },
      }),
    }),
  )
  async add_photo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    photo: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      if (typeof user_id == 'undefined') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          error: 'please provide user id',
        });
      }
      console.log('user', user_id, typeof user_id);
      console.log(photo);
      const result = await this.onboardingService.add_photo(user_id, photo);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_video')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/video',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const extArray = file.mimetype.split('/');
          const exten = extArray[extArray.length - 1];
          return cb(null, `${randomName}.${exten}`);
        },
      }),
    }),
  )
  async add_video(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(mp4|webm)' })],
      }),
    )
    video: Express.Multer.File,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.add_video(
        headers.user.id,
        video,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_signature')
  @UseInterceptors(
    FileInterceptor('signature', {
      storage: diskStorage({
        destination: './uploads/signature',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const extArray = file.mimetype.split('/');
          const exten = extArray[extArray.length - 1];
          return cb(null, `${randomName}.${exten}`);
        },
      }),
    }),
  )
  async add_signature(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      }),
    )
    signature: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      if (typeof user_id == 'undefined') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          error: 'please provide user id',
        });
      }
      console.log('user_id    ', user_id);
      const result = await this.onboardingService.add_signature(
        user_id,
        signature,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_photo')
  async get_photo_details(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.get_photo_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_video')
  async get_video_details(@Headers() headers, @Res() res: Response) {
    try {
      const result = await this.onboardingService.get_video_details(
        headers.user.id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_signature')
  async get_signature_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.get_signature_details(
        user_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_video_otp')
  async get_video_otp(@Headers() headers, @Res() res: Response) {
    try {
      const result = await this.onboardingService.get_video_otp(
        headers.user.id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_geo_tag')
  async add_geo_tag(
    @Body() addGeoTagDto: AddGeoTagDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.add_geo_tag(
        headers.user.id,
        addGeoTagDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_aadhaar_number')
  async add_aadhaar_number(
    @Body() addAadhaarNumberDto: AddAadhaarNumberDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.add_aadhaar_number(
        headers.user.id,
        addAadhaarNumberDto,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_aadhaar_number')
  async verify_aadhaar_number(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingService.get_aadhaar_number(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/initiate_esign')
  async initiate_esign(
    @Headers() headers,
    @Res() res: Response,
    @Body('user_id') user_id: number,
  ) {
    try {
      const result = await this.onboardingService.initiate_esign(
        user_id,
        headers.tenant_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Post('onboarding/esign_postback/:tenant_id')
  async esign_callback(@Req() request: Request, @Headers() headers) {
    try {
      console.log('request.query', request.query);
      console.log('request.body', request.body);

      const result = await this.onboardingService.esign_callback(
        request.query,
        request.body,
      );
      return { message: 'ok' };
      // return result;
    } catch (error) {
      return { message: 'Something went wrong' };
    }
  }

  @Get('onboarding/esign_postback/:tenant_id')
  @Render('esign_postback')
  async esign_postback(@Req() request: Request, @Headers() headers) {
    try {
      console.log('request.query', request.query);

      const result = await this.onboardingService.esign_postback(request.query);
      return result;
    } catch (error) {
      return { message: 'Something went wrong' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/create_investor')
  async create_investor(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.create_investor(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: HttpStatus.BAD_REQUEST, error: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('v2/onboarding/create_investor')
  async create_investor_v2(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.create_investor_v2(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: HttpStatus.BAD_REQUEST, error: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/create_investment_account')
  async create_investment_account(@Res() res: Response, @Headers() headers) {
    try {
      const result = await this.onboardingService.create_investment_account(
        headers.user.id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: HttpStatus.BAD_REQUEST, error: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_status')
  async get_status(
    @Res() res: Response,
    @Headers() headers,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingService.get_status(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/identity_documents')
  async identity_documents(
    @Res() res: Response,
    @Body('user_id') user_id: number,
    @Headers() headers,
  ) {
    try {
      console.log('user_id', user_id);
      const result = await this.onboardingService.identity_documents(
        user_id,
        headers.tenant_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Get('/onboarding/identity_redirect')
  @Render('digilocker_redirect')
  async identity_redirect() {
    return { message: 'redirected' };
  }

  @Get('onboarding/identity_postback/:tenant_id')
  @Render('identity_document_postback')
  async identity_document_postback(
    @Query('requestId') requestId,
    @Query('status') status,
    @Req() request: Request,
    @Res() res: Response,
    @Headers() headers,
  ) {
    try {
      let result;
      if (status != 'success') {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'Sorry Identity Document Fetch Status is ' + status,
        };
      } else {
        result = await this.onboardingService.identity_document_postback(
          requestId,
          status,
        );
      }
      console.log('RESULT POSTBACK', result);
      return result;
    } catch (error) {
      console.log(error);
      return { message: 'Something went wrong' };
    }
  }

  @Get('onboarding/get_kyc_details')
  async getKycStatus(@Res() res: Response, @Query('user_id') user_id) {
    try {
      console.log('user_id', user_id);
      const result = await this.onboardingService.getKycStatus(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Post('onboarding/add_ucc')
  async addUcc(
    @Headers() header,
    @Res() res: Response,
    @Body() body: { user_id: number },
  ) {
    try {
      console.log('user_id', body.user_id);
      const result = await this.onboardingService.add_ucc(
        body.user_id,
        header.tenant_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @Post('onboarding/add_ucc_v2')
  async addUccv2(
    @Headers() header,
    @Res() res: Response,
    @Body() body: { user_id: number },
  ) {
    try {
      console.log('user_id', body.user_id);
      const result = await this.onboardingService.add_uccv2(
        body.user_id,
        header.tenant_id,
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  // @Post('onboarding/pdf')
  // async addpdf(@Res() res: Response, @Body() body: { user_id: number }) {
  //     try {
  //         // console.log("user_id", body.user_id);
  //         let result = await this.onboardingService.createpdfv2(body.user_id);
  //         return res.status(result.status).json(result);
  //     } catch (error) {
  //         return res.status(HttpStatus.BAD_REQUEST).json({ "status": HttpStatus.BAD_REQUEST, "error": "sorry something went wrong, " + error.message });
  //     }
  // }
}
