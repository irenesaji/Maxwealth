import { Module } from '@nestjs/common';
import { HtmlCleanerController } from './html-cleaner.controller';
import { HtmlCleanerService } from './html-cleaner.service';

@Module({
  controllers: [HtmlCleanerController],
  providers: [HtmlCleanerService],
})
export class HtmlCleanerModule {}
