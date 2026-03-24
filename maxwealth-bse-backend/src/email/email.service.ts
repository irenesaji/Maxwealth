import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Imap from 'imap-simple';
import { simpleParser } from 'mailparser';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as sevenZip from 'node-7z';
import * as readline from 'readline';
import { DBFFile } from 'dbffile';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CamsInvestorMasterFoliosService } from 'src/cams_investor_master_folios/cams_investor_master_folios.service';
import { InvestorDetailsService } from 'src/investor-details/investor-details.service';
import { KfintechInvestorMasterFoliosService } from 'src/kfintech_investor_master_folios/kfintech_investor_master_folios.service';
import { KfintechTransactionMasterFoliosService } from 'src/kfintech_transaction_master_folios/kfintech_transaction_master_folios.service';
import { Fileprocess } from 'src/fileprocess/entities/fileprocess.entity';
import * as quotedPrintable from 'quoted-printable';
import { CreateFileprocessDto } from 'src/fileprocess/dto/create-fileprocess.dto';
import { stringify } from 'csv-stringify';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private readonly camsInvestorMasterFoliosService: CamsInvestorMasterFoliosService,
    private readonly investorDetailsService: InvestorDetailsService,
    private readonly kfintechTransactionMasterFoliosService: KfintechTransactionMasterFoliosService,
    private readonly kfintechInvestorMasterFoliosService: KfintechInvestorMasterFoliosService,
    @InjectRepository(Fileprocess)
    private readonly fileprocessRepo: Repository<Fileprocess>,
  ) {
    console.log('EmailService initialized');
  }

  private imapConfig = {
    imap: {
      user: this.configService.get<string>('EMAIL_USER'),
      password: this.configService.get<string>('EMAIL_PASSWORD'),
      host: this.configService.get<string>('IMAP_HOST'),
      port: this.configService.get<number>('IMAP_PORT'),
      tls: true,
      authTimeout: 300000,
      tlsOptions: { rejectUnauthorized: false },
    },
  };

  private transporter = nodemailer.createTransport({
    host: this.configService.get<string>('SMTP_HOST'),
    port: this.configService.get<number>('SMTP_PORT'),
    secure: this.configService.get<boolean>('SMTP_SECURE'), // true for 465, false for other ports
    auth: {
      user: this.configService.get<string>('EMAIL_USER'),
      pass: this.configService.get<string>('EMAIL_PASSWORD'),
    },
  });

  file_path = process.env.FILE_PATH;
  async readEmails() {
    console.log('Attempting to read emails...');
    try {
      const connection = await Imap.connect(this.imapConfig);
      console.log('IMAP connection established.');

      await connection.openBox('INBOX');
      console.log('Opened INBOX.');

      const searchCriteria = ['UNSEEN'];
      const fetchOptions = {
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
        markSeen: true,
      };
      console.log('Searching for unseen emails...');

      const messages = await connection.search(searchCriteria, fetchOptions);
      console.log(`Found ${messages.length} new messages.`);
      for (const message of messages) {
        const headerPart = message.parts.find(
          (part) => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        );
        console.log('Header Part', headerPart);

        const subject = headerPart?.body?.subject
          ? headerPart.body.subject[0]
          : 'No Subject';
        const receivedTimeUTC = headerPart?.body?.date
          ? new Date(headerPart.body.date[0])
          : null;

        console.log('Subject', subject);

        // Convert UTC to IST
        const receivedTimeIST = receivedTimeUTC
          ? receivedTimeUTC.toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
            })
          : 'No Date';
        console.log('Received Time', receivedTimeIST);

        const subjectWithTime = `Subject: ${subject}, Received Time (IST): ${receivedTimeIST}`;
        console.log(subjectWithTime);

        const fileprocessdto = new CreateFileprocessDto();
        fileprocessdto.file_name = subjectWithTime;
        const savedfile = await this.fileprocessRepo.save(fileprocessdto);
        console.log('File Processed and saved');

        const from = headerPart?.body?.from ? headerPart.body.from[0] : '';
        console.log('From', from);

        const parsedEmail = await simpleParser(
          message.parts.find((part) => part.which === 'TEXT').body,
        );
        console.log('Parsed', parsedEmail);

        if (subject.includes('WBR2. Investor Transactions')) {
          console.log('Inside');
          console.log(`Processing email from: ${from}`);
          console.log(`Subject: ${subject}`);

          const textPart = message.parts.find((part) => part.which === 'TEXT');
          console.log('Texttt', textPart);
          if (!textPart) {
            console.error('Text part of the email not found.');
            continue; // Skip this email if no text body is found
          }
          const decodedBody = quotedPrintable.decode(textPart.body);
          console.log('Decoded Email Body:', decodedBody);

          // const emailBody = parsedEmail.text || parsedEmail.html;
          const downloadLink = this.extractDownloadLink(decodedBody); // Implement this function to extract link from email
          console.log('Download Link', downloadLink);

          if (downloadLink) {
            console.log(`Found download link: ${downloadLink}`);

            const downloadDir = `${this.file_path}/downloads`;

            const timestamp = new Date()
              .toISOString()
              .replace(/[-:.]/g, '')
              .slice(0, 15); // YYYYMMDDTHHmmSS format

            // Split the filename and extension
            const outputFilename = 'investor-transaction.zip';
            const fileParts = outputFilename.split('.');
            const filename = fileParts[0];
            const extension = fileParts[1] ? `.${fileParts[1]}` : '';

            // Add the timestamp to the filename
            const timestampedFilename = `${filename}_${timestamp}${extension}`;

            // Download the ZIP file
            await this.downloadFile(downloadLink, timestampedFilename);
            console.log('File downloaded successfully.');

            const filePath =
              `${this.file_path}/downloads/${timestampedFilename}`.replace(
                /\s+/g,
                '',
              );
            if (fs.existsSync(filePath)) {
              console.log('File downloaded successfully:', filePath);
            } else {
              console.error('File not found:', filePath);
            }

            // Extract the downloaded ZIP file with the password
            const extractPassword = process.env.EXTRACT_PASSWORD;
            const extractedDir = `${this.file_path}/extractedfiles/investor-transaction`;
            await this.extractZipWithPassword(
              downloadDir,
              timestampedFilename,
              extractedDir,
              extractPassword,
            );
            console.log('ZIP file extracted successfully.');

            await this.processFilesforCAMS(extractedDir, savedfile.id);
            console.log('ZIP file converted to csv successfully.');
          } else {
            console.log('No download link found.');
          }
        } else if (subject.includes('WBR9. Investor Static details feed')) {
          console.log('Inside');
          console.log(`Processing email from: ${from}`);
          console.log(`Subject: ${subject}`);

          const textPart = message.parts.find((part) => part.which === 'TEXT');
          console.log('Texttt', textPart);
          if (!textPart) {
            console.error('Text part of the email not found.');
            continue; // Skip this email if no text body is found
          }
          const decodedBody = quotedPrintable.decode(textPart.body);
          console.log('Decoded Email Body:', decodedBody);

          const downloadLink = this.extractDownloadLink(decodedBody); // Implement this function to extract link from email
          console.log('Download Link', downloadLink);

          if (downloadLink) {
            console.log(`Found download link: ${downloadLink}`);

            const downloadDir = `${this.file_path}/downloads`;

            const timestamp = new Date()
              .toISOString()
              .replace(/[-:.]/g, '')
              .slice(0, 15); // YYYYMMDDTHHmmSS format

            // Split the filename and extension
            const outputFilename = 'investor-static-details.zip';
            const fileParts = outputFilename.split('.');
            const filename = fileParts[0];
            const extension = fileParts[1] ? `.${fileParts[1]}` : '';

            // Add the timestamp to the filename
            const timestampedFilename = `${filename}_${timestamp}${extension}`;

            // Download the ZIP file
            await this.downloadFile(downloadLink, timestampedFilename);
            console.log('File downloaded successfully.');

            const filePath =
              `${this.file_path}/downloads/${timestampedFilename}`.replace(
                /\s+/g,
                '',
              );
            if (fs.existsSync(filePath)) {
              console.log('File downloaded successfully:', filePath);
            } else {
              console.error('File not found:', filePath);
            }

            // Extract the downloaded ZIP file with the password
            const extractPassword = process.env.EXTRACT_PASSWORD;
            const extractedDir = `${this.file_path}/extractedfiles/investor-static-details`;
            await this.extractZipWithPassword(
              downloadDir,
              timestampedFilename,
              extractedDir,
              extractPassword,
            );
            console.log('ZIP file extracted successfully.');

            await this.processFilesforCAMS(extractedDir, savedfile.id);
            console.log('ZIP file converted to csv successfully.');
          } else {
            console.log('No download link found.');
          }
        } else if (
          subject.includes(
            'Subscribed Master AUM/Investor Master Details Report',
          )
        ) {
          console.log('Inside');
          console.log(`Processing email from: ${from}`);
          console.log(`Subject: ${subject}`);

          const textPart = message.parts.find((part) => part.which === 'TEXT');
          console.log('Texttt', textPart);
          if (!textPart) {
            console.error('Text part of the email not found.');
            continue; // Skip this email if no text body is found
          }
          const decodedBody = quotedPrintable.decode(textPart.body);
          console.log('Decoded Email Body:', decodedBody);
          // const emailBody = parsedEmail.text || parsedEmail.html;
          // console.log("Email: ", emailBody)
          const downloadLink = this.extractDownloadLinkKarvyText(decodedBody); // Implement this function to extract link from email
          console.log('Download Link', downloadLink);

          if (downloadLink) {
            console.log(`Found download link: ${downloadLink}`);

            const downloadDir = `${this.file_path}/downloads`;

            const timestamp = new Date()
              .toISOString()
              .replace(/[-:.]/g, '')
              .slice(0, 15); // YYYYMMDDTHHmmSS format

            // Split the filename and extension
            const outputFilename = 'investor-master-info.zip';
            const fileParts = outputFilename.split('.');
            const filename = fileParts[0];
            const extension = fileParts[1] ? `.${fileParts[1]}` : '';

            // Add the timestamp to the filename
            const timestampedFilename = `${filename}_${timestamp}${extension}`;

            // Download the ZIP file
            await this.downloadFile(downloadLink, timestampedFilename);
            console.log('File downloaded successfully.');

            const filePath =
              `${this.file_path}/downloads/${timestampedFilename}`.replace(
                /\s+/g,
                '',
              );
            if (fs.existsSync(filePath)) {
              console.log('File downloaded successfully:', filePath);
            } else {
              console.error('File not found:', filePath);
            }

            // Extract the downloaded ZIP file with the password
            const extractPassword = process.env.EXTRACT_KARVY_PASSWORD;
            const extractedDir = `${this.file_path}/extractedfiles/investor-master-info`;
            await this.extractZipWithPassword(
              downloadDir,
              timestampedFilename,
              extractedDir,
              extractPassword,
            );
            console.log('ZIP file extracted successfully.');

            await this.processFilesforKarvy(extractedDir, savedfile.id);
            console.log('ZIP file converted to csv successfully.');
          } else {
            console.log('No download link found.');
          }
        } else if (subject.includes('Subscribed Transaction Feeds Report')) {
          console.log('Inside');
          console.log(`Processing email from: ${from}`);
          console.log(`Subject: ${subject} `);

          const emailBody = parsedEmail.text || parsedEmail.html;
          console.log('Email: ', emailBody);
          const downloadLink = this.extractDownloadLinkKarvy(emailBody); // Implement this function to extract link from email
          console.log('Download Link', downloadLink);

          if (downloadLink) {
            console.log(`Found download link: ${downloadLink} `);

            const downloadDir = `${this.file_path}/downloads`;

            const timestamp = new Date()
              .toISOString()
              .replace(/[-:.]/g, '')
              .slice(0, 15); // YYYYMMDDTHHmmSS format

            const outputFilename = 'transaction-report.zip';
            const fileParts = outputFilename.split('.');
            const filename = fileParts[0];
            const extension = fileParts[1] ? `.${fileParts[1]} ` : '';
            const timestampedFilename = `${filename}_${timestamp}${extension} `;

            await this.downloadFile(downloadLink, timestampedFilename);
            console.log('File downloaded successfully.');

            const filePath =
              `${this.file_path}/downloads/${timestampedFilename}`.replace(
                /\s+/g,
                '',
              );
            if (fs.existsSync(filePath)) {
              console.log('File downloaded successfully:', filePath);
            } else {
              console.error('File not found:', filePath);
            }

            // Extract the downloaded ZIP file with the password
            const extractPassword = process.env.EXTRACT_KARVY_PASSWORD;
            console.log('Extract password ', extractPassword);
            const extractedDir = `${this.file_path}/extractedfiles/transaction-report`;
            await this.extractZipWithPassword(
              downloadDir,
              timestampedFilename,
              extractedDir,
              extractPassword,
            );
            console.log('ZIP file extracted successfully.');

            await this.processFilesforKarvy(extractedDir, savedfile.id);
            console.log('ZIP file converted to csv successfully.');
          } else {
            console.log('No download link found.');
          }
        }

        const processedfile = await this.fileprocessRepo.findOne({
          where: { id: savedfile.id },
        });
        processedfile.is_processed = true;
        await this.fileprocessRepo.save(processedfile);
      }

      console.log('Completed tasks');

      connection.end();
      console.log('IMAP connection closed.');
    } catch (err) {
      console.log('Error', err);
      console.error('Error reading emails:', err.message);
    }
  }

  // extractDownloadLink(emailBody: string): string | null {
  //   // Regex to match URLs and avoid trailing punctuation
  //   const downloadLinkRegex = /(https?:\/\/[^\s>'"]+)/g;
  //   const matches = emailBody ? emailBody.match(downloadLinkRegex) : [];

  //   console.log("Matched Links:", matches);

  //   if (matches && matches.length > 0) {
  //     // Sanitize the first matched URL
  //     const cleanLink = matches[0]
  //       .replace(/['">]+$/, '') // Remove trailing single quotes, double quotes, or angle brackets
  //       .trim(); // Trim any leading or trailing whitespace
  //     return cleanLink;
  //   }

  //   return null;
  // }

  extractDownloadLink(emailBody: string): string | null {
    // Regex to specifically match URLs starting with https://mailback9.camsonline.com/mailback_result/ and ending with .zip
    const downloadLinkRegex =
      /https:\/\/mailback\d+\.camsonline\.com\/mailback_result\/[^\s>'"]+\.zip/g;
    const matches = emailBody ? emailBody.match(downloadLinkRegex) : [];

    console.log('Matched Links:', matches);

    if (matches && matches.length > 0) {
      // Sanitize the first matched URL
      const cleanLink = matches[0]
        .replace(/['">]+$/, '') // Remove trailing single quotes, double quotes, or angle brackets
        .trim(); // Trim any leading or trailing whitespace
      return cleanLink;
    } else {
      console.log('NO LINKS FOUND IGNORING');
    }

    return null;
  }

  extractDownloadLinkKarvy(emailBody: string): string | null {
    // Regex to match URLs and avoid trailing punctuation
    const downloadLinkRegex =
      /(https:\/\/(scdelivery\.kfintech\.[a-z]+)\/[^\s<>]+)/g;
    const matches = emailBody ? emailBody.match(downloadLinkRegex) : [];
    console.log('Matched Link:', matches);
    if (matches && matches.length > 0) {
      // Sanitize the first matched URL
      const cleanLink = matches[3]
        .replace(/['">]+$/, '') // Remove trailing single quotes, double quotes, or angle brackets
        .trim(); // Trim any leading or trailing whitespace
      return cleanLink;
    }

    return null;
  }

  // extractDownloadLinkKarvyText(emailBody: string): string | null {
  //   // Regex to match URLs and avoid trailing punctuation
  //   const downloadLinkRegex = /(https:\/\/(scdelivery\.kfintech\.[a-z]+)\/[^\s<>]+)/g;
  //   const matches = emailBody ? emailBody.match(downloadLinkRegex) : [];
  //   console.log("Matched Link:", matches);
  //   if (matches && matches.length > 0) {
  //     // Sanitize the first matched URL
  //     const cleanLink = matches[0]
  //       .replace(/['">]+$/, '') // Remove trailing single quotes, double quotes, or angle brackets
  //       .trim(); // Trim any leading or trailing whitespace
  //     return cleanLink;
  //   }

  //   return null;
  // }
  extractDownloadLinkKarvyText(emailBody: string): string | null {
    if (!emailBody) return null;

    const downloadLinkRegex =
      /https:\/\/scdelivery\.kfintech\.[a-z]+\/[^\s"'>)]+/g;
    const matches = emailBody.match(downloadLinkRegex) || [];

    // Remove trailing punctuation and deduplicate
    const cleanedLinks = [
      ...new Set(matches.map((link) => link.replace(/['">)]+$/, '').trim())),
    ];

    console.log('Filtered Links:', cleanedLinks);

    // Prefer links that don’t have u=undefined
    const validLink = cleanedLinks.find(
      (link) => !link.includes('u=undefined'),
    );

    return validLink || cleanedLinks[0] || null;
  }

  async downloadFile(url: string, outputFilename: string): Promise<void> {
    const downloadDir = path.resolve(`${this.file_path}`, 'downloads');
    const filePath = path.join(downloadDir, outputFilename);

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
      console.log(`Created directory: ${downloadDir} `);
    }

    const writer = fs.createWriteStream(filePath);

    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      });

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('Error downloading file:', error.message);
      throw error;
    }
  }

  // Function to extract ZIP file with password
  async extractZipWithPassword(
    downloadDir: string,
    zipFilename: string,
    extractedDir: string,
    password: string,
  ): Promise<void> {
    const zipFilePath = path.join(downloadDir, zipFilename);

    // Ensure the extraction directory exists
    if (!fs.existsSync(extractedDir)) {
      fs.mkdirSync(extractedDir, { recursive: true });
      console.log(`Created extraction directory: ${extractedDir} `);
    }

    // Use node-7z to extract with a password
    const extractStream = sevenZip.extractFull(zipFilePath, extractedDir, {
      password: password,
      $bin: require('7zip-bin').path7za, // Use the 7zip executable
    });

    return new Promise((resolve, reject) => {
      extractStream.on('end', () => {
        console.log('Extraction complete');

        // Generate timestamp
        const timestamp = new Date()
          .toISOString()
          .replace(/[-:.]/g, '')
          .slice(0, 15); // Format: YYYYMMDDTHHmmSS

        // Add timestamp to extracted files
        fs.readdir(extractedDir, (err, files) => {
          if (err) {
            console.error('Error reading extracted directory:', err);
            reject(err);
          }

          files.forEach((file) => {
            console.log(`Processing file: ${file} `);
            const oldPath = path.join(extractedDir, file);
            console.log(`Old path: ${oldPath} `);
            const fileExt = path.extname(file);
            console.log(`File extension: ${fileExt} `);
            const fileNameWithoutExt = path.basename(file, fileExt);
            console.log(`File name without extension: ${fileNameWithoutExt} `);
            // const newFileName = `${fileNameWithoutExt}_${timestamp}${fileExt} `;
            const newFileName = `${timestamp}${fileExt}`;
            console.log(`New file name: ${newFileName} `);
            const newPath = path.join(extractedDir, newFileName);

            fs.renameSync(oldPath, newPath);
            console.log(`Renamed ${oldPath} to ${newPath} `);
          });

          resolve();
        });
      });

      extractStream.on('error', (err: any) => {
        console.error('Extraction error:', err);
        reject(err);
      });
    });
  }

  async processFilesforCAMS(extractedDir: string, file_id: number) {
    const csvDir = path.join(`${this.file_path}`, 'converted-csv-files');
    console.log('CSV Directory', csvDir);

    // Ensure the csv output directory exists
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    // Read the extracted directory and process only the specified files
    fs.readdir(extractedDir, async (err, files) => {
      if (err) {
        console.error('Error reading extracted directory:', err);
        return;
      }

      // Filter files based on input files array
      for (const file of files) {
        const filePath = path.join(extractedDir, file);
        const fileExt = path.extname(file).toLowerCase().trim(); // Ensure extension is clean
        let fileName = path.basename(file, fileExt).trim(); // Clean up the filename, without extension

        console.log('File extension:', fileExt);
        console.log('File name without extension:', fileName);

        // Process DBF files
        if (fileExt === '.dbf') {
          if (fileName.endsWith('.dbf')) {
            fileName = fileName.slice(0, -4);
          }
          console.log(`Converting DBF file: ${fileName}`);

          const csvFilePath = path.join(csvDir, `${fileName}.csv`);
          try {
            await this.convertDbfToCsv(filePath, csvFilePath);
            console.log('New CSV Path:', csvFilePath);
            await this.camsInvestorMasterFoliosService.transaction_reports(
              csvFilePath,
            );
            await this.investorDetailsService.Camstransactions(
              csvFilePath,
              file_id,
            );
          } catch (error) {
            console.error(`Error converting DBF file ${fileName}:`, error);
          }
        }
        // Process CSV files
        else if (fileExt === '.csv') {
          console.log(`Found CSV file: ${fileName}`);

          const targetPath = path.join(csvDir, `${fileName}.csv`);
          try {
            // Move CSV to target directory
            fs.renameSync(filePath, targetPath);
            console.log(`Moved CSV file to: ${targetPath}`);

            // Additional processing
            await this.camsInvestorMasterFoliosService.investor_reports(
              targetPath,
            );
            await this.investorDetailsService.Camsinvestors(targetPath);
          } catch (error) {
            console.error(`Error processing CSV file ${fileName}:`, error);
          }
        }
        // Skip unsupported files
        else {
          console.log(`Skipping unsupported file type: ${fileName}${fileExt}`);
        }
      }
    });
  }

  async processFilesforKarvy(extractedDir: string, file_id: number) {
    const csvDir = path.join(`${this.file_path}`, 'converted-csv-files');
    console.log('CSV Directory', csvDir);

    // Ensure the csv output directory exists
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    // Read the extracted directory and process only the specified files
    fs.readdir(extractedDir, async (err, files) => {
      if (err) {
        console.error('Error reading extracted directory:', err);
        return;
      }

      // Filter files based on input files array
      for (const file of files) {
        const filePath = path.join(extractedDir, file);
        const fileExt = path.extname(file).toLowerCase().trim(); // Ensure extension is clean
        let fileName = path.basename(file, fileExt).trim(); // Clean up the filename, without extension

        console.log('File extension:', fileExt);
        console.log('File name without extension:', fileName);

        // Process DBF files
        if (fileExt === '.txt') {
          if (fileName.endsWith('.txt')) {
            fileName = fileName.slice(0, -4);
          }
          console.log(`Converting DBF file: ${fileName}`);

          const csvFilePath = path.join(csvDir, `${fileName}.csv`);
          try {
            await this.convertTxtToCsv(filePath, csvFilePath);
            console.log('New CSV Path:', csvFilePath);
            await this.kfintechInvestorMasterFoliosService.create(csvFilePath);
            await this.investorDetailsService.Karvyinvestors(csvFilePath);
            console.log('txt_updated');
          } catch (error) {
            console.error(`Error converting DBF file ${fileName}:`, error);
          }
        }
        // Process CSV files
        else if (fileExt === '.csv') {
          console.log(`Found CSV file: ${fileName}`);

          const targetPath = path.join(csvDir, `${fileName}`);
          try {
            // Move CSV to target directory
            fs.renameSync(filePath, targetPath);
            console.log(`Moved CSV file to: ${targetPath}`);
            // Additional processing
            await this.kfintechTransactionMasterFoliosService.create(
              targetPath,
            );
            await this.investorDetailsService.Karvytransactions(
              targetPath,
              file_id,
            );
          } catch (error) {
            console.error(`Error processing CSV file ${fileName}:`, error);
          }
        }
        // Skip unsupported files
        else {
          console.log(`Skipping unsupported file type: ${fileName}${fileExt}`);
        }
      }
    });
  }

  async convertDbfToCsv(
    dbfFilePath: string,
    csvFilePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Remove .dbf extension and add .csv
      const finalCsvPath = csvFilePath.replace(/\.dbf\s*$/, '.csv');

      DBFFile.open(dbfFilePath)
        .then((dbf) => dbf.readRecords())
        .then((records) => {
          const csvContent = this.convertRecordsToCsv(records);
          fs.writeFile(finalCsvPath, csvContent, (err) => {
            if (err) {
              console.error('Error writing CSV:', err);
              reject(err);
            } else {
              console.log(
                `Successfully converted and saved CSV: ${finalCsvPath}`,
              );
              fs.unlink(dbfFilePath, (unlinkErr) => {
                if (unlinkErr) {
                  console.error('Error deleting DBF file:', unlinkErr);
                  reject(unlinkErr);
                } else {
                  console.log(`Successfully deleted DBF file: ${dbfFilePath}`);
                  resolve();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.error('Error converting DBF to CSV:', err);
          reject(err);
        });
    });
  }
  // Helper function to convert DBF records to CSV format
  convertRecordsToCsv(records: any[]): string {
    if (records.length === 0) return ''; // Handle empty records
    const header = Object.keys(records[0]).join(',');
    const rows = records
      .map((record) => Object.values(record).join(','))
      .join('\n');
    return `${header} \n${rows} `;
  }

  async convertTxtToCsv(
    txtFilePath: string,
    csvFilePath: string,
    delimiter = '~',
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const finalCsvPath = csvFilePath.replace(/\.txt\s*$/, '.csv');

      const fileStream = fs.createReadStream(txtFilePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      // const writeStream = fs.createWriteStream(finalCsvPath);

      // rl.on('line', (line: string) => {
      //   const values = line.split(delimiter).map(v => `"${v.trim()}"`); // wrap values in quotes
      //   writeStream.write(values.join(',') + '\n');
      // });

      const writeStream = fs.createWriteStream(finalCsvPath);
      const stringifier = stringify();
      stringifier.pipe(writeStream);
      rl.on('line', (line: string) => {
        const values = line.split(delimiter).map((v) => v.trim());
        stringifier.write(values);
      });

      rl.on('close', () => {
        writeStream.end();
        console.log(`Successfully converted and saved CSV: ${finalCsvPath}`);
        fs.unlink(txtFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting TXT file:', unlinkErr);
            reject(unlinkErr);
          } else {
            console.log(`Successfully deleted TXT file: ${txtFilePath}`);
            resolve();
          }
        });
      });

      rl.on('error', (err) => {
        console.error('Error reading TXT file:', err);
        reject(err);
      });
    });
  }
}
