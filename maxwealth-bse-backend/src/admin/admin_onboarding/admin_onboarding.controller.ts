import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Crud, CrudController } from '@dataui/crud';
import { AdminOnboardingService } from './admin_onboarding.service';
import { UserOnboardingDetails } from 'src/onboarding/entities/user_onboarding_details.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import Role from 'src/auth/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';
@Crud({
  model: {
    type: UserOnboardingDetails,
  },
  query: {
    join: {
      // Include associations in the response
      user_nominee_details: { eager: true }, // Example relation (if defined in the entity)
      user_address_details: { eager: true },
      user_bank_details: { eager: true },
      user: { eager: true }, // Another example relation
      // Another example relation
    },
  },
})
@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('api/admin/onboarding')
export class AdminOnboardingController
  implements CrudController<UserOnboardingDetails>
{
  constructor(public service: AdminOnboardingService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async User(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    // @Query('sortBy') sortBy?: string,
    // @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    console.log('Entering');
    const result = await this.service.get_users(page, limit);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add_signature')
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
    @Body('user_onboarding_detail_id') user_onboarding_detail_id: number,
    @Res() res: Response,
  ) {
    try {
      console.log('loooog');
      const result = await this.service.add_signature(
        user_onboarding_detail_id,
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
  @Get('/search')
  async search(
    @Res() res: Response,
    @Query('query') query?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    // @Query('sortBy') sortBy?: string,
    // @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    const result = await this.service.search(
      query,
      status,
      startDate,
      endDate,
      page,
      limit,
    );
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search_user')
  async searchUser(
    @Res() res: Response,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    // @Query('sortBy') sortBy?: string,
    // @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    console.log('Entering');
    const result = await this.service.search_user(query, page, limit);
    return res.status(result.status).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/total_investors')
  async get_total_users(
    @Res() res: Response,
    @Query('filter') filter: string,
    @Query('year') year: number,
  ) {
    const result = await this.service.get_total_investors(filter, year);
    return res.status(200).json(result);
  }
}
