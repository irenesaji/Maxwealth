import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Res,
  Query,
  Headers,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  Render,
} from '@nestjs/common';
import { Onboardingv2Service } from './onboardingv2.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CheckKycDto } from 'src/onboarding/dtos/check-kyc.dto';
import { Response } from 'express';
import { ConfirmPanDetailsDto } from 'src/onboarding/dtos/confirm-pan-details.dto';
import { AddPersonalDetailsDto } from 'src/onboarding/dtos/add-personal-details.dto';
import { AddOccupationDetailsDto } from 'src/onboarding/dtos/add-occupation-details.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import { AddAddressDetailsDto } from 'src/onboarding/address/dtos/add-address-details.dto';
const storage = multer.memoryStorage();

@Controller('api/v2/')
export class Onboardingv2Controller {
  constructor(
    private readonly onboardingv2Service: Onboardingv2Service,
    private readonly onboardingService: OnboardingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/check_kyc')
  async check_kyc(@Body() checkKycDto: CheckKycDto, @Res() res: Response) {
    try {
      const result = await this.onboardingv2Service.check_kyc(checkKycDto);
      console.log('res 1', result);

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
      const result = await this.onboardingv2Service.confirm_pan_details(
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
      const result = await this.onboardingv2Service.get_confirm_pan_details(
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
      const result = await this.onboardingv2Service.add_personal_details(
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
      const result = await this.onboardingv2Service.get_personal_details(
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
  @Get('onboarding/get_occupation_details')
  async get_occupation_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingv2Service.get_occupation_details(
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
  @Get('onboarding/get_onboarding_details')
  async get_onboarding_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingv2Service.get_onboarding_details(
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
      const result = await this.onboardingv2Service.add_occupation_details(
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
  @Post('onboarding/add_photo')
  @UseInterceptors(FileInterceptor('photo'))
  async add_photo(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.onboardingv2Service.add_photo(user_id, file);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_pan_photo')
  @UseInterceptors(FileInterceptor('photo'))
  async add_pan_photo(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.onboardingv2Service.add_pan_photo(user_id, file);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_aadhar')
  @UseInterceptors(FileInterceptor('photo'))
  async add_aadhar(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.onboardingv2Service.add_aadhar(user_id, file);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_cancelled_cheque')
  @UseInterceptors(FileInterceptor('photo'))
  async add_cancelled_cheque(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.onboardingv2Service.add_cancelled_cheque(
      user_id,
      file,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/add_signature')
  @UseInterceptors(FileInterceptor('photo'))
  async add_signature(
    @UploadedFile() file: Express.Multer.File,
    @Body('user_id') user_id: number,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const result = await this.onboardingv2Service.add_signature(user_id, file);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_signature')
  async get_signature_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('user_id') user_id,
  ) {
    try {
      const result = await this.onboardingv2Service.get_signature_details(
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
  @Get('onboarding/get_photo')
  async get_photo_details(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.get_photo_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_aadhar')
  async get_aadhar_details(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.get_aadhar_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_pan')
  async get_pan_details(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.get_pan_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/get_cheque')
  async get_cheque_details(
    @Headers() headers,
    @Query('user_id') user_id,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.get_cheque_details(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding/address')
  async add_address_details(
    @Body() addAddressDetailsDto: AddAddressDetailsDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.add_address_details(
        addAddressDetailsDto,
      );
      console.log(result);

      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('onboarding/address')
  async get_address_details(@Headers() headers, @Res() res: Response) {
    try {
      console.log('Get');
      const result = await this.onboardingv2Service.get_address_details(
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
  @Post('onboarding/final_upload')
  async final_upload(
    @Body('user_id') user_id: number,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.onboardingv2Service.final_upload(user_id);
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

  @Post('onboarding/pdf')
  async addpdf(
    @Res() res: Response,
    @Body() body: { user_id: number },
    @Headers() header,
  ) {
    try {
      // console.log("user_id", body.user_id);
      const result = await this.onboardingv2Service.createpdf(
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

  @Post('onboarding/convert')
  @UseInterceptors(FileInterceptor('file')) // Handle single file upload
  async convert(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.onboardingv2Service.convertPdfToBase64(
      file.buffer,
    );
    return res.status(200).json(result);
  }

  @Get('onboarding/update_pdf')
  async update_pdf(@Res() res: Response, @Query('user_id') user_id) {
    const result = await this.onboardingv2Service.update_pdf(user_id);
    return res.status(200).json(result);
  }

  @Get('onboarding/esign/postback/:tenant_id')
  @Render('test')
  async esign(@Res() res: Response, @Query() query: { user_id: number }) {
    try {
      // console.log("request", request.body);
      const result = await this.onboardingv2Service.esignPage(query.user_id);
      console.log('RESSSS', result.data);
      return result;
    } catch (error) {
      return { message: 'Something went wrong,' + error.message };
    }
  }
}
