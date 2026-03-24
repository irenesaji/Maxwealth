import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CamsEncryptDecryptService } from './cams_encrypt_decrypt.service';
import { Response } from 'express';

@Controller('cams-encrypt-decrypt')
export class CamsEncryptDecryptController {
  constructor(
    private readonly camsEncryptDecryptService: CamsEncryptDecryptService,
  ) {}

  @Get('encrypt')
  async encrypt(@Res() res: Response, @Body() body) {
    const secretKey = process.env.CAMSKRA_ENCRYPTION_KEY; // Replace with your base64 key
    console.log('Secret Key', secretKey); // Replace with your base64 key
    const iv = process.env.CAMSKRA_ENCRYPTION_IV; // 16 bytes = 128 bits for AES
    console.log('Generated IV:', iv);
    const plainText = body;

    const result = await this.camsEncryptDecryptService.encryptStringToBytesAES(
      plainText,
      secretKey,
      iv,
    );
    return res.status(result.status).json(result);
  }

  @Get('decrypt')
  async decrypt(@Res() res: Response, @Body() body) {
    const encryptedText = body.data; // Replace with your Base64 encrypted text
    const secretKey = process.env.CAMSKRA_ENCRYPTION_KEY; // Replace with your Base64 key
    const iv = process.env.CAMSKRA_ENCRYPTION_IV; // Replace with your Base64 IV

    const result =
      await this.camsEncryptDecryptService.decryptStringFromBytesAES(
        encryptedText,
        secretKey,
        iv,
      );
    return res.status(result.status).json(result);
  }

  @Post('digilocker_encrypt')
  async digilocker_encrypt(@Body() body, @Res() res: Response) {
    const result = await this.camsEncryptDecryptService.digilocker_encrypt(
      body,
    );
    return res.status(result.status).json(result);
  }

  @Post('digilocker_decrypt')
  async digilocker_decrypt(
    @Body() body: { data: string; key: string; hash: string },
    @Res() res: Response,
  ) {
    const { data, key, hash } = body;
    const result = await this.camsEncryptDecryptService.digilocker_decrypt(
      data,
      key,
      hash,
    );
    return res.status(result.status).json(result);
  }
}
