import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';

@Injectable()
export class HtmlCleanerService {
  cleanHtml(input: string): string {
    // Replace occurrences of \" with "
    const cleanedInput = input.replace(/\\"/g, '"');

    // Parse the HTML string
    const $ = cheerio.load(cleanedInput);

    // Clean up unwanted elements (e.g., remove inline styles, remove empty tags, etc.)
    $('script').remove();
    $('style').remove();

    // Optionally, you can clean whitespace or reformat the HTML
    const finalCleanedHtml = $.html()
      .replace(/\r\n|\r|\n|\t/g, ' ')
      .replace(/ +/g, ' ')
      .trim();

    return finalCleanedHtml;
  }
}
