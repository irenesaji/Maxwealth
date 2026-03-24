import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

import { Repository } from 'typeorm';
import { UserOnboardingDetails } from '../../../onboarding/entities/user_onboarding_details.entity';
import { AddProofsDto } from '../../../onboarding/proofs/dtos/add-proofs.dto';
import { Proofs } from '../../../onboarding/proofs/entities/proofs.entity';
import { cwd } from 'process';
import { ProofsRepository } from 'src/repositories/proofs.repository';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';

@Injectable()
export class AdminProofsService {
  constructor(
    // @InjectRepository(Proofs)
    // private proofsRepository: Repository<Proofs>,
    // @InjectRepository(UserOnboardingDetails)
    // private userOnboardingDetailsRepository : Repository<UserOnboardingDetails>,

    private readonly userOnboardingDetailsRepository: UserOnboardingDetailsRepository,
    private readonly proofsRepository: ProofsRepository,

    private readonly usersService: UsersService,
  ) {}

  async add_proof(files, addProofsDto: AddProofsDto) {
    try {
      console.log('log 1');
      const userData = await this.usersService.findOneById(
        addProofsDto.user_id,
      );
      const user = userData?.user;
      if (userData !== null && user) {
        const onboarding = await this.userOnboardingDetailsRepository.findOneBy(
          {
            user_id: user.id,
          },
        );
        if (!onboarding) {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Please check your KYC compliance first',
          };
        }
        onboarding.status = addProofsDto.type;
        let proof = await this.proofsRepository.findOneBy({
          user_id: user.id,
          type: addProofsDto.type,
        });
        if (!proof) {
          proof = new Proofs();
        }
        proof.user = user;
        proof.document_id_number = addProofsDto.document_id_number;
        proof.type = addProofsDto.type;
        proof.document_type = addProofsDto.document_type;
        proof.proof_expiry_date = addProofsDto.proof_expiry_date;
        proof.proof_issue_date = addProofsDto.proof_issue_date;

        if (files.front_side_file && files.front_side_file.length > 0) {
          proof.front_document_path = files.front_side_file[0].path;
          // var front_side_upload_result = await this.fintechService.fileToUpload(cwd()+"/"+proof.front_document_path);
          // if(front_side_upload_result.status == HttpStatus.OK){
          //     proof.fp_front_document_url = front_side_upload_result.data.url;
          //     proof.fp_front_side_file_id = front_side_upload_result.data.id;
          //     if(proof.type == "proof_of_identity"){
          //         let result = await this.fintechService.update_proof_of_identity(proof,onboarding.kyc_id);
          //         if(result.status != HttpStatus.OK){
          //             return result;
          //         }
          //     }
          // }else{
          //     return front_side_upload_result;
          // }
        } else {
          return {
            status: HttpStatus.BAD_REQUEST,
            error: 'Front Side Document Upload not found',
          };
        }

        if (files.back_side_file && files.back_side_file.length > 0) {
          proof.back_document_path = files.back_side_file[0].path;
          // var back_document_path_result = await this.fintechService.fileToUpload(cwd()+"/"+proof.back_document_path);
          // if(back_document_path_result.status == HttpStatus.OK){
          //     proof.fp_back_document_url = back_document_path_result.data.url;;
          //     proof.fp_back_side_file_id = back_document_path_result.data.id; ;
          // }else{
          //     return back_document_path_result;
          // }
        }

        await this.proofsRepository.save(proof);

        await this.userOnboardingDetailsRepository.save(onboarding);
        return { status: HttpStatus.OK, message: 'Updated the details' };
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }

  async get_proof(user_id: number, type: string) {
    try {
      const userData = await this.usersService.findOneById(user_id);
      const user = userData?.user;
      if (userData != null && user) {
        const proof = await this.proofsRepository.findOneBy({
          user_id: user.id,
          type: type,
        });
        if (proof) {
          return { status: HttpStatus.OK, data: proof };
        } else {
          return { status: HttpStatus.NOT_FOUND, error: 'No Onboarding found' };
        }
      } else {
        return { status: HttpStatus.BAD_REQUEST, error: 'User not found' };
      }
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, error: err.message };
    }
  }
}
