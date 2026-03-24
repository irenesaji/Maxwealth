import { HttpStatus, Injectable } from '@nestjs/common';
import { AmcRepository } from 'src/repositories/amc.repository';

@Injectable()
export class AmcsService {
  constructor(private amcsRepository: AmcRepository) {}

  async get_all_active() {
    try {
      const result = await this.amcsRepository.find({
        where: { is_active: true },
      });
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async getbyId(id: number) {
    try {
      const result = await this.amcsRepository.findOne({
        where: { amcId: id },
      });
      return { status: HttpStatus.OK, data: result };
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
