import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Headers,
  Post,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AddressService } from './address.service';
import { AddAddressDetailsDto } from './dtos/add-address-details.dto';
import { Response } from 'express';

@Controller('api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add_address_details(
    @Body() addAddressDetailsDto: AddAddressDetailsDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.addressService.add_address_details(
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
  @Get()
  async get_address_details(@Headers() headers, @Res() res: Response) {
    try {
      const result = await this.addressService.get_address_details(
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
  @Get('/pincode')
  async get_fp_address_details(
    @Headers() headers,
    @Res() res: Response,
    @Query('pincode') pincode,
  ) {
    try {
      const result = await this.addressService.get_fp_pincode_address(pincode);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        error: 'sorry something went wrong, ' + error.message,
      });
    }
  }
}
