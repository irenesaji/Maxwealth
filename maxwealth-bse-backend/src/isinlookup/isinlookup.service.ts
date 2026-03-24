import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as puppeteer from 'puppeteer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ISINLookupResult } from 'src/transactions/types/transaction.types';

@Injectable()
export class ISINLookupService {
  private readonly logger = new Logger(ISINLookupService.name);

  constructor(private readonly httpService: HttpService) {}

  // Alternative 1: Using Puppeteer for dynamic web scraping
  async fetchISINFromNSDLWithPuppeteer(
    schemeName: string,
  ): Promise<string | null> {
    console.log(`Starting Puppeteer ISIN lookup for scheme: ${schemeName}`);
    try {
      // Launch a headless browser
      const browser = await puppeteer.launch({ headless: true });
      console.log('Browser launched successfully');
      const page = await browser.newPage();

      // Navigate to the NSDL website
      console.log('Navigating to NSDL website');
      await page.goto('https://nsdl.co.in/mutual-fund-popup.htm', {
        waitUntil: 'networkidle0',
      });

      // Enter scheme name and search
      console.log(`Entering scheme name: ${schemeName}`);
      await page.type('#scheme-input', schemeName);
      await page.click('#search-button');

      // Wait for results
      console.log('Waiting for results table');
      await page.waitForSelector('.results-table');

      // Extract ISIN
      console.log('Extracting ISIN from results');
      const isin = await page.evaluate((schemeName) => {
        const rows = document.querySelectorAll('.results-table tr');
        for (const row of rows) {
          if (row.textContent.includes(schemeName)) {
            const isinCell = row.querySelector('td:contains("ISIN")');
            return isinCell
              ? isinCell.nextElementSibling.textContent.trim()
              : null;
          }
        }
        return null;
      }, schemeName);

      // Close browser
      console.log('Closing browser');
      await browser.close();

      console.log(`ISIN found for ${schemeName}: ${isin}`);
      return isin;
    } catch (error) {
      console.error(`Puppeteer ISIN lookup error for ${schemeName}:`, error);
      this.logger.error(
        `Puppeteer ISIN lookup error for ${schemeName}:`,
        error,
      );
      return null;
    }
  }

  // Alternative Batch Lookup Method 2: Rate-Limited Concurrent Lookups
  async batchISINLookupRateLimited(
    schemeNames: string[],
    maxConcurrent = 5,
  ): Promise<ISINLookupResult[]> {
    console.log(
      `Starting rate-limited batch ISIN lookup for ${schemeNames.length} schemes`,
    );
    const results: ISINLookupResult[] = [];

    // Process in batches
    for (let i = 0; i < schemeNames.length; i += maxConcurrent) {
      console.log(`Processing batch starting at index ${i}`);
      const batch = schemeNames.slice(i, i + maxConcurrent);
      console.log('BAtch:', batch);

      const batchResults = await Promise.all(
        batch.map(async (schemeName) => {
          console.log(`Looking up ISIN for scheme: ${schemeName}`);
          const isin = await this.fetchISINFromNSDLWithPuppeteer(schemeName);
          console.log(`Completed lookup for ${schemeName}, ISIN: ${isin}`);
          return {
            schemeName,
            isin,
          };
        }),
      );

      results.push(...batchResults);

      // Optional: Add a delay between batches to reduce load
      console.log('Adding delay between batches');
      await this.delay(1000);
    }

    console.log(
      `Rate-limited batch lookup complete. Total results: ${results.length}`,
    );
    return results;
  }

  async findIsinFromWeb(
    prodCodes: string[],
  ): Promise<{ schemeName: string; isin: string | null }[]> {
    console.log(
      `Starting batch ISIN lookup for ${prodCodes.length} product codes.`,
    );

    const browser = await puppeteer.launch({ headless: true });
    const results: { schemeName: string; isin: string | null }[] = [];

    const batchSize = 5; // Number of product codes to process per batch
    const delayBetweenBatches = 1000; // Delay between batches in milliseconds

    // Split the product codes into batches
    const batches = this.splitIntoBatches(prodCodes, batchSize);

    for (const [index, batch] of batches.entries()) {
      console.log(
        `Processing batch ${index + 1} of ${batches.length} with ${
          batch.length
        } product codes.`,
      );

      const batchResults = await Promise.all(
        batch.map(async (prodCode) => {
          const page = await browser.newPage();
          let isin: string | null = null;

          try {
            const searchQuery = `site:finance.yahoo.com OR site:moneycontrol.com OR site:reuters.com "${prodCode}" ISIN`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
              searchQuery,
            )}`;

            console.log(
              `Navigating to: ${googleSearchUrl} for product code: ${prodCode}`,
            );
            await page.goto(googleSearchUrl, {
              waitUntil: 'networkidle2',
              timeout: 60000,
            });

            const pageContent = await page.content();
            console.log(`Page content loaded for product code: ${prodCode}`);

            const isinRegex = /[A-Z]{2}[A-Z0-9]{9}[0-9]/g;
            const isinMatches = pageContent.match(isinRegex);

            if (isinMatches && isinMatches.length > 0) {
              isin = isinMatches[0];
              console.log(`ISIN found for ${prodCode}: ${isin}`);
            } else {
              console.warn(`No ISIN found for product code: ${prodCode}`);
            }
          } catch (error) {
            console.error(
              `Error processing product code: ${prodCode}. Error: ${error.message}`,
            );
          } finally {
            await page.close();
          }

          return {
            schemeName: prodCode,
            isin,
          };
        }),
      );

      results.push(...batchResults);

      // Optional: Add a delay between batches to reduce load
      console.log('Adding delay between batches');
      await this.delay(delayBetweenBatches);
    }

    await browser.close();

    console.log(`Batch lookup complete. Total results: ${results.length}`);
    return results;
  }

  private splitIntoBatches(array: string[], batchSize: number): string[][] {
    const batches: string[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }
  // Utility method for adding delay
  private delay(ms: number): Promise<void> {
    console.log(`Delaying for ${ms} milliseconds`);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
