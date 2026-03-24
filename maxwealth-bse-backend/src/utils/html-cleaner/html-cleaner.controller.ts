import { Controller, Post, Body } from '@nestjs/common';
import { HtmlCleanerService } from './html-cleaner.service';

@Controller('html-cleaner')
export class HtmlCleanerController {
  constructor(private readonly htmlCleanerService: HtmlCleanerService) {}

  @Post('clean')
  cleanHtml(@Body('html') html: string) {
    return { cleanedHtml: this.htmlCleanerService.cleanHtml(html) };
  }
}
