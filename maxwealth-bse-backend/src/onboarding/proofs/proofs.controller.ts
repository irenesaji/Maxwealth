import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ProofsService } from './proofs.service';
import { Response } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { AddProofsDto } from './dtos/add-proofs.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { extension } from 'mime-types';
@Controller('api/proofs')
export class ProofsController {
  constructor(private readonly proofsService: ProofsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'front_side_file' }, { name: 'back_side_file' }],
      {
        storage: diskStorage({
          destination: './uploads/proofs',
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
      },
    ),
  )
  async add_proofs(
    @UploadedFiles()
    files: {
      front_side_file?: Express.Multer.File[];
      back_side_file?: Express.Multer.File[];
    },
    @Body() addProofsDto: AddProofsDto,
    @Headers() headers,
    @Res() res: Response,
  ) {
    console.log(addProofsDto);
    console.log(files);
    // console.log(back_side_file);
    try {
      const result = await this.proofsService.add_proof(files, addProofsDto);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:type')
  async get_proof(
    @Param('type') type,
    @Headers() headers,
    @Res() res: Response,
  ) {
    try {
      const result = await this.proofsService.get_proof(headers.user.id, type);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
