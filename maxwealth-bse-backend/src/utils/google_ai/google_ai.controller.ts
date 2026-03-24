import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GoogleAiService } from './google_ai.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { GoogleAiInputDTO } from './dtos/google_ai_input.dto';
import { Response } from 'express';

@Controller('/api/v1/ai')
export class GoogleAiController {
  constructor(private readonly google_ai_service: GoogleAiService) {}

  @Post('/llm_execute/get_action')
  async llm_get_action(
    @Res() res: Response,
    @Body() google_ai_input: GoogleAiInputDTO,
  ) {
    google_ai_input.query =
      "the mutual fund categories - High Returns,tax saver, top rated, sip 100, best index funds, beat fd, sip 500, gold funds,global funds,sectoral funds,liquid funds, govt funds. Direct the user in the website to view fund details which has these features : greet, compare funds, funds categories, search funds and none of the above, respond with one of the above features only, the users query is '" +
      google_ai_input.query +
      "'";
    const result = await this.google_ai_service.llm_execute(google_ai_input);
    return res.status(result.status).json(result);
  }

  @Post('/llm_execute/get_search_query')
  async llm_search_query(
    @Res() res: Response,
    @Body() google_ai_input: GoogleAiInputDTO,
  ) {
    google_ai_input.query =
      "extract the search query from this '" +
      google_ai_input.query +
      "' if there is no string then just return 'NA'";
    const result = await this.google_ai_service.llm_execute(google_ai_input);
    return res.status(result.status).json(result);
  }

  @Post('/llm_execute/get_category')
  async get_category(
    @Res() res: Response,
    @Body() google_ai_input: GoogleAiInputDTO,
  ) {
    google_ai_input.query =
      " the listed categories - High Returns,tax saver, top rated, sip 100, best index funds, beat fd, sip 500, gold funds,global funds,sectoral funds,liquid funds, govt funds . Extract the listed category from this sentence '" +
      google_ai_input.query +
      "' if there is no available category from the listed categories then just return 'NA', ";
    const result = await this.google_ai_service.llm_execute(google_ai_input);
    return res.status(result.status).json(result);
  }
}
