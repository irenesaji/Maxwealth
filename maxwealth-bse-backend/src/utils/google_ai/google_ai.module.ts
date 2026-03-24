import { Module } from '@nestjs/common';
import { GoogleAiService } from './google_ai.service';
import { GoogleAiController } from './google_ai.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GoogleAiService],
  controllers: [GoogleAiController],
})
export class GoogleAiModule {}
