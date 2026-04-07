import { HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { UserOnboardingDetailsRepository } from 'src/repositories/user_onboarding_details.repository';
import path from 'path';
import fs from 'fs';

interface CryptoResponse {
  status: HttpStatus;
  data?: string;
  key?: string;
  hash?: string;
  message?: string;
  integrityVerified?: boolean;
}
@Injectable()
export class CamsEncryptDecryptService {
  private readonly digilocker_aes_key: Buffer;
  private readonly digilocker_aes_iv: Buffer;
  private digilocker_public_key: string;
  private our_public_key: string;
  private our_private_key: string;
  private digilocker_user_id: string;
  private digilocker_password: string;
  private intermediary_code: string;
  private node_options: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersOnboardingRepository: UserOnboardingDetailsRepository,
  ) {
    const fallbackKey = Buffer.alloc(32).toString('base64');
    const fallbackIv = Buffer.alloc(16).toString('base64');

    this.digilocker_aes_key = Buffer.from(
      configService.get<string>('DIGILOCKER_AES_KEY') || fallbackKey,
      'base64',
    );
    this.digilocker_aes_iv = Buffer.from(
      configService.get<string>('DIGILOCKER_AES_IV') || fallbackIv,
      'base64',
    );
    this.digilocker_public_key = configService.get('DIGILOCKER_PUBLIC_KEY');
    this.our_public_key = configService.get('DIGILOCKER_CLIENT_PUBLIC_KEY');
    this.our_private_key = configService.get('DIGILOCKER_CLIENT_PRIVATE_KEY');
    this.digilocker_user_id = configService.get('DIGILOCKER_USER_ID');
    this.digilocker_password = configService.get('DIGILOCKER_PASSWORD');
    this.intermediary_code = configService.get('INTERMEDIARY_ID');
    this.node_options = configService.get('NODE_OPTIONS');
  }

  async encryptStringToBytesAES(
    plainText: string | object,
    base64Key: string,
    base64IV: string,
  ) {
    try {
      // Ensure the plainText is a string
      if (typeof plainText === 'object') {
        plainText = JSON.stringify(plainText); // Convert object to string if it's an object
      }

      if (!plainText || plainText.length <= 0) {
        throw new Error('plainText must be a non-empty string');
      }

      // Validate base64Key and base64IV
      if (!base64Key || base64Key.length <= 0) {
        throw new Error('Key is required');
      }
      if (!base64IV || base64IV.length <= 0) {
        throw new Error('IV is required');
      }

      // Decode base64 key and IV
      const key = Buffer.from(base64Key, 'base64');
      const iv = Buffer.from(base64IV, 'base64');

      // Ensure key and IV lengths are correct
      if (key.length !== 32) {
        throw new Error(
          'Invalid key length. Key must be 32 bytes for AES-256-CBC.',
        );
      }
      if (iv.length !== 16) {
        throw new Error(
          'Invalid IV length. IV must be 16 bytes for AES-256-CBC.',
        );
      }

      // Create the cipher and encrypt the plainText
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      cipher.setAutoPadding(true);

      let encrypted = cipher.update(plainText, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Return the encrypted data in the required format
      return {
        status: HttpStatus.OK,
        data: encrypted, // The base64 encrypted data
        encryptFlag: 'Y',
      };
    } catch (error) {
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  async decryptStringFromBytesAES(
    encryptedText: string,
    base64Key: string,
    base64IV: string,
  ) {
    try {
      // Validate encryptedText
      if (!encryptedText || encryptedText.length <= 0) {
        throw new Error('Encrypted text is required');
      }

      // Validate base64Key and base64IV
      if (!base64Key || base64Key.length <= 0) {
        throw new Error('Key is required');
      }
      if (!base64IV || base64IV.length <= 0) {
        throw new Error('IV is required');
      }

      // Decode base64 key and IV
      const key = Buffer.from(base64Key, 'base64');
      const iv = Buffer.from(base64IV, 'base64');

      // Ensure key and IV lengths are correct
      if (key.length !== 32) {
        throw new Error(
          'Invalid key length. Key must be 32 bytes for AES-256-CBC.',
        );
      }
      if (iv.length !== 16) {
        throw new Error(
          'Invalid IV length. IV must be 16 bytes for AES-256-CBC.',
        );
      }

      // Create the decipher and decrypt the encryptedText
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      decipher.setAutoPadding(true); // Ensures automatic padding is handled

      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // Check if decrypted text is a JSON string (original was an object)
      try {
        return { status: HttpStatus.OK, data: JSON.parse(decrypted) };
      } catch {
        // If it fails, return plain text
        return { status: HttpStatus.OK, data: decrypted };
      }
    } catch (error) {
      console.error('Decryption error:', error); // Log the error for debugging
      return { status: HttpStatus.BAD_REQUEST, data: error.message };
    }
  }

  // async digilocker_encrypt(data: Record<string, any>) {
  //   try {
  //     let user_id = this.digilocker_user_id;
  //     let password = this.digilocker_password;
  //     let intermediary_code = this.intermediary_code;
  //     let stringified_data;

  //     let updated_data = {
  //       UserID: user_id,
  //       Password: password,
  //       IntermediaryID: intermediary_code,
  //       ...data
  //     };

  //     console.log("Starting Encryption...");
  //     console.log("Original Plain Data:", updated_data);

  //     if (typeof updated_data === 'object') {
  //       stringified_data = JSON.stringify(updated_data);
  //     }
  //     console.log("Converted Plain Data:", stringified_data);

  //     // Generate AES Key (256-bit) and IV (128-bit)
  //     const aesKey = crypto.randomBytes(32); // 32 bytes = 256 bits
  //     const aesIv = crypto.randomBytes(16); // 16 bytes = 128 bits
  //     console.log("Generated AES Key (Base64):", aesKey.toString('base64'));
  //     console.log("Generated AES IV (Base64):", aesIv.toString('base64'));

  //     // Concatenate AES key and IV
  //     const keyIvString = `${aesKey.toString('base64')}|${aesIv.toString('base64')}`;
  //     console.log("AES Key & IV String:", keyIvString);

  //     // Load RSA Public Key for encryption (PKCS#1 v1.5)
  //     const rsaKey = forge.pki.publicKeyFromPem(this.digilocker_public_key);
  //     console.log("RSA Public Key:", rsaKey);

  //     // Encrypt AES Key & IV using **PKCS#1 v1.5**
  //     const encryptedKey = forge.util.encode64(
  //       rsaKey.encrypt(forge.util.encodeUtf8(keyIvString), 'RSAES-PKCS1-V1_5')
  //     );
  //     console.log("RSA PKCS1 Encrypted AES Key & IV:", encryptedKey);

  //     // Encrypt Data using AES-256-CBC
  //     const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
  //     let encryptedData = cipher.update(stringified_data, 'utf8', 'base64');
  //     encryptedData += cipher.final('base64');
  //     console.log("AES Encrypted Data:", encryptedData);

  //     // Compute SHA-256 Hash of Plain Data
  //     const hash = CryptoJS.SHA256(stringified_data).toString(CryptoJS.enc.Hex);
  //     console.log("SHA256 Hash:", hash);

  //     // Encrypt Hash using AES
  //     const hashCipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
  //     let encryptedHash = hashCipher.update(hash, 'utf8', 'base64');
  //     encryptedHash += hashCipher.final('base64');
  //     console.log("AES Encrypted Hash:", encryptedHash);

  //     console.log("Encryption Successful!");

  //     return {
  //       status: HttpStatus.OK,
  //       data: encryptedData,
  //       key: encryptedKey,
  //       hash: encryptedHash
  //     };

  //   } catch (error) {
  //     console.error("Encryption error:", error.message, error.stack);
  //     return {
  //       status: HttpStatus.BAD_REQUEST,
  //       message: error.message
  //     };
  //   }
  // }

  async digilocker_encrypt(data) {
    try {
      console.log('DAta', data);
      const user_details = await this.usersOnboardingRepository.findOne({
        where: { user_id: data.user_id },
        relations: ['user'],
      });
      if (!user_details) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'User not found',
        };
      }
      console.log('Public Key:', this.digilocker_public_key);

      const timestamp = Date.now().toString();

      // Generate a random 12-character alphanumeric string
      const randomString = Array.from({ length: 12 }, () =>
        Math.random().toString(36).charAt(2),
      ).join('');

      // Combine timestamp and random string
      const uniquerefNo = `${timestamp}_${randomString}`;
      console.log('Unique Reference No:', uniquerefNo);

      // User Credentials
      const updated_data = {
        UserID: this.digilocker_user_id,
        Password: this.digilocker_password,
        IntermediaryID: this.intermediary_code,
        TranReqNo: uniquerefNo,
        SessionID: uniquerefNo,
        DocumentType: 'PAN,ADH',
        PAN: user_details.pan,
        Mobile: user_details.user.mobile,
        Email: user_details.user.email,
      };

      console.log('Starting Encryption...');
      console.log('Original Plain Data:', updated_data);

      // Convert Data to JSON
      const stringified_data = JSON.stringify(updated_data);

      // Generate AES Key (256-bit) and IV (128-bit)
      const aesKey = crypto.randomBytes(32);
      console.log('Generated AES Key (Base64):', aesKey.toString('base64'));
      const aesIv = crypto.randomBytes(16);
      console.log('Generated AES IV (Base64):', aesIv.toString('base64'));

      // Concatenate AES key and IV
      const keyIvString = `${aesIv.toString('base64')}|${aesKey.toString(
        'base64',
      )}`;
      console.log('AES Key & IV String:', keyIvString);

      // Encrypt AES Key & IV using RSA PKCS#1 v1.5
      const encryptedKey = crypto
        .publicEncrypt(
          {
            key: this.digilocker_public_key.replace(/\\n/g, '\n'), // Ensure proper formatting
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(keyIvString, 'utf8'),
        )
        .toString('base64');
      console.log('RSA PKCS1 Encrypted AES Key & IV:', encryptedKey);

      // Encrypt Data using AES-256-CBC
      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
      let encryptedData = cipher.update(stringified_data, 'utf8', 'base64');
      encryptedData += cipher.final('base64');

      // Compute SHA-256 Hash
      const hash = crypto
        .createHash('sha256')
        .update(stringified_data)
        .digest('hex');

      // Encrypt Hash using AES
      const hashCipher = crypto.createCipheriv('aes-256-cbc', aesKey, aesIv);
      let encryptedHash = hashCipher.update(hash, 'utf8', 'base64');
      encryptedHash += hashCipher.final('base64');

      console.log('Encryption Successful!');

      return {
        status: HttpStatus.OK,
        data: encryptedData,
        key: encryptedKey,
        hash: encryptedHash,
      };
    } catch (error) {
      console.error('Encryption error:', error.message);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }

  //   async digilocker_decrypt(encryptedData, encryptedKey, encryptedHash) {
  //     try {

  //       console.log("Starting Decryption...");

  //       // // Decrypt the AES key and IV using RSA private key
  //       const decryptedKeyIv = crypto.privateDecrypt(
  //         {
  //           key: this.our_private_key.replace(/\\n/g, "\n"),
  //           padding: crypto.constants.RSA_PKCS1_PADDING
  //         },
  //         Buffer.from(encryptedKey, "base64")
  //       ).toString("utf8");

  //       console.log("Decrypted Key & IV String:", decryptedKeyIv);

  //       // Split the decrypted string to get IV and AES key
  //       // let decryptedKeyIv = `pU+9oPTma/bHjjJdabKC/Q==|G3t1LhBPe1A/tuo7a49agpulnVy2e199/gt7RoRu0ik=`
  //       const [ivBase64, keyBase64] = decryptedKeyIv.split("|");
  //       const aesIv = Buffer.from(ivBase64, "base64");
  //       const aesKey = Buffer.from(keyBase64, "base64");

  //       console.log("Extracted AES Key (Base64):", keyBase64);
  //       console.log("Extracted AES IV (Base64):", ivBase64);

  //       // Decrypt the data using AES-256-CBC
  //       const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesIv);
  //       let decryptedData = decipher.update(encryptedData, "base64", "utf8");
  //       decryptedData += decipher.final("utf8");

  //       // Parse the decrypted JSON data
  //       const parsedData = JSON.parse(decryptedData);
  //       console.log("Decrypted Data:", parsedData);

  //       // Decrypt the hash
  //       const hashDecipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesIv);
  //       let decryptedHash = hashDecipher.update(encryptedHash, "base64", "utf8");
  //       decryptedHash += hashDecipher.final("utf8");

  //       // Compute hash of decrypted data for verification
  //       const computedHash = crypto.createHash("sha256")
  //         .update(decryptedData)
  //         .digest("hex");

  //       // Verify hash
  //       if (computedHash !== decryptedHash) {
  //         throw new Error("Data integrity check failed: Hash mismatch");
  //       }

  //       console.log("Hash verification successful!");
  //       console.log("Decryption Successful!");

  //       return {
  //         status: HttpStatus.OK,
  //         data: parsedData
  //       };

  //     } catch (error) {
  //       console.error("Decryption error:", error.message);
  //       return {
  //         status: HttpStatus.BAD_REQUEST,
  //         message: error.message
  //       };
  //     }
  //   }

  // }

  //Test Digilocker decrypt
  async digilocker_decrypt(
    encryptedData,
    encryptedKey,
    encryptedHash,
    paramData?,
  ) {
    try {
      console.log('Starting Decryption...');

      // Decrypt the AES key and IV using RSA private key
      const decryptedKeyIv = crypto
        .privateDecrypt(
          {
            key: this.our_private_key.replace(/\\n/g, '\n'),
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(encryptedKey, 'base64'),
        )
        .toString('utf8');

      console.log('Decrypted Key & IV String:', decryptedKeyIv);

      // Extract IV and AES key
      const [ivBase64, keyBase64] = decryptedKeyIv.split('|');
      const aesIv = Buffer.from(ivBase64, 'base64');
      const aesKey = Buffer.from(keyBase64, 'base64');

      console.log('Extracted AES Key (Base64):', keyBase64);
      console.log('Extracted AES IV (Base64):', ivBase64);

      // Decrypt the main data
      const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, aesIv);
      let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
      decryptedData += decipher.final('utf8');

      // Parse JSON
      const parsedData = JSON.parse(decryptedData);
      console.log('Decrypted Data:', parsedData);

      // Decrypt the hash
      const hashDecipher = crypto.createDecipheriv(
        'aes-256-cbc',
        aesKey,
        aesIv,
      );
      let decryptedHash = hashDecipher.update(encryptedHash, 'base64', 'utf8');
      decryptedHash += hashDecipher.final('utf8');

      // Compute and verify hash
      const computedHash = crypto
        .createHash('sha256')
        .update(decryptedData)
        .digest('hex');
      if (computedHash !== decryptedHash) {
        throw new Error('Data integrity check failed: Hash mismatch');
      }

      console.log('Hash verification successful!');
      console.log('User id', paramData);

      const savedFilePath = null;

      // Check if CDLData[0].Document exists and decrypt it
      // if (parsedData.CDLData && parsedData.CDLData.length > 0 && parsedData.CDLData[0].Document) {
      const onboarding = await this.usersOnboardingRepository.findOne({
        where: { user_id: paramData.user_id },
      });
      console.log('Onboarding', onboarding);
      if (onboarding) {
        const result = parsedData.CDLData.find(
          (item) => item.DocumentType === 'ADH',
        );
        console.log('Result');

        onboarding.verified_aadhaar_number = onboarding.aadhaar_number;
        onboarding.aadhar_xml = result.XmlString;
        onboarding.status = 'digilocker';
        await this.usersOnboardingRepository.save(onboarding);
        console.log('AdhaarXML saved successfully');
      }
      // }

      console.log('Decryption Successful!');

      return {
        status: HttpStatus.OK,
        data: parsedData,
        documentPath: savedFilePath, // Return the saved file path
      };
    } catch (error) {
      console.log('Eooror', error);
      console.error('Decryption error:', error.message);
      return {
        status: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}

//   async digilocker_decrypt(
//     encryptedData: string,
//     encryptedKey: string,
//     encryptedHash: string
//   ) {
//     try {
//       console.log("Starting Decryption...");
//       console.log("Private key", this.client_private_key)

//       // Load RSA Private Key
//       const rsaKey = forge.pki.privateKeyFromPem(this.client_private_key);
//       console.log("RSA Private Key Loaded.");

//       console.log("Encrypted Key:", encryptedKey)

//       // Decrypt AES Key & IV using RSA-PKCS1 v1.5
//       const decryptedKeyIvString = rsaKey.decrypt(
//         forge.util.decode64(encryptedKey),
//         'RSAES-PKCS1-V1_5' // Corrected RSA decryption mode
//       );
//       console.log("Decrypted AES Key & IV String:", decryptedKeyIvString);

//       // Extract AES Key & IV
//       const [aesKeyBase64, ivBase64] = decryptedKeyIvString.trim().split('|');
//       const aesKey = Buffer.from(aesKeyBase64, 'base64');
//       const iv = Buffer.from(ivBase64, 'base64');
//       console.log("Extracted AES Key & IV.");

//       // Decrypt AES-encrypted data
//       const decryptedData = this.aesDecrypt(encryptedData, aesKey, iv);
//       console.log("Decrypted Data:", decryptedData);

//       // Decrypt AES-encrypted hash
//       const decryptedHash = this.aesDecrypt(encryptedHash, aesKey, iv);
//       console.log("Decrypted Hash:", decryptedHash);

//       // Compute SHA-256 hash of decrypted data
//       const computedHash = CryptoJS.SHA256(decryptedData).toString(CryptoJS.enc.Hex);
//       console.log("Computed Hash:", computedHash);

//       // Verify integrity
//       if (computedHash !== decryptedHash) {
//         throw new Error("Data integrity verification failed!");
//       }
//       console.log("Data integrity verified successfully.");

//       return { status: HttpStatus.OK, data: decryptedData, integrityVerified: true };
//     } catch (error) {
//       console.error("Decryption error:", error.message);
//       return { status: HttpStatus.BAD_REQUEST, message: error.message };
//     }
//   }

//   // AES-256-CBC Decryption Helper
//   private aesDecrypt(encryptedText: string, key: Buffer, iv: Buffer): string {
//     const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
//     let decrypted = decipher.update(encryptedText, "base64", "utf8");
//     decrypted += decipher.final("utf8");
//     return decrypted;
//   }

// }

// function EncryptAESKeyUsingPublicKey(AESKey) {
//   return new Promise((resolve, reject) => {
//     try {
//       const publicKey = fs.readFileSync("./UAT_PublicCertificate/eMudhraCertificate_20251206.pem", "utf8");
//       const buffer = Buffer.from(AESKey);

//       const encrypted = crypto.publicEncrypt(
//         {
//           key: publicKey,
//           padding: crypto.constants.RSA_PKCS1_PADDING,
//         },
//         buffer
//       );

//       resolve(encrypted.toString("base64"));
//     } catch (error) {
//       console.error("Encryption Error:", error);
//       reject(error);
//     }
//   });
// }

// EncryptAESKeyUsingPublicKey: function (AESKey) {
//   return new Promise(async function (resolve, reject) {
//     let key;
//     let xml_string;
//     var buffer;
//     var encrypted;

//     try {
//       key = new _nodersa();
//       xml_string = fs.readFileSync("./UAT_PublicCertificate/eMudhraCertificate_20251206.pem", "utf8");

//       buffer = Buffer.from(AESKey);
//       encrypted = crypto.publicEncrypt({
//         key: xml_string,
//         padding: crypto.constants.RSA_PKCS1_PADDING
//       }, buffer)

//       return resolve(encrypted.toString("base64"));
//     }
//     catch (error) {
//       console.log(error);
//     } finally {
//       key = null;
//       xml_string = null;
//       buffer = null;
//       encrypted = null;
//     }
//   });
// },

// ekycEncDec: function (Mode, AESKey, EncryptingText) {
//   return new Promise(function (resolve, reject) {
//     let keyText = AESKey.split("|")[1];
//     let ivText = AESKey.split("|")[0];
//     let CipherDecipher;
//     let EncDecValue;
//     let keyBuffer;
//     let ivBuffer;

//     try {

//       keyText = Buffer.from(keyText, "base64");
//       ivText = Buffer.from(ivText, "base64");

//       keyBuffer = Buffer.from(keyText, "utf-8");
//       ivBuffer = Buffer.from(ivText, "utf8");

//       if (Mode == "Encrypt") {
//         CipherDecipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
//         EncDecValue = (CipherDecipher.update(EncryptingText, "utf8", "base64") + CipherDecipher.final("base64"));

//         return resolve(EncDecValue);
//       }
//       else if (Mode == "Decrypt") {

//         CipherDecipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
//         EncDecValue = (CipherDecipher.update(EncryptingText, "base64", "utf8") + CipherDecipher.final("utf8"));

//         return resolve(EncDecValue);
//       }
//     }
//     catch (error) {
//       console.log(error);
//     } finally {
//       keyText = null;
//       ivText = null;
//       CipherDecipher = null;
//       EncDecValue = null;
//       keyBuffer = null;
//       ivBuffer = null;
//     }
//   })
// },

// ekycHash: function (Mode, AESKey, ckyc_data) {
//   return new Promise(function (resolve, reject) {
//     let keyText = AESKey.split("|")[1];
//     let ivText = AESKey.split("|")[0];
//     let CipherDecipher;
//     let EncDecValue;
//     let keyBuffer;
//     let ivBuffer;
//     let hashvalue = crypto.createHash('sha256').update(ckyc_data).digest("hex").toString('base64');
//     try {

//       keyText = Buffer.from(keyText, "base64");
//       ivText = Buffer.from(ivText, "base64");

//       keyBuffer = Buffer.from(keyText, "utf-8");
//       ivBuffer = Buffer.from(ivText, "utf8");

//       if (Mode == "Encrypt") {
//         CipherDecipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
//         EncDecValue = (CipherDecipher.update(hashvalue, "utf8", "base64") + CipherDecipher.final("base64"));

//         return resolve(EncDecValue);
//       }
//       else if (Mode == "Decrypt") {

//         CipherDecipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
//         EncDecValue = (CipherDecipher.update(hashvalue, "base64", "utf8") + CipherDecipher.final("utf8"));

//         return resolve(EncDecValue);
//       }
//     }
//     catch (error) {
//       console.log(error);
//     } finally {
//       keyText = null;
//       ivText = null;
//       CipherDecipher = null;
//       EncDecValue = null;
//       keyBuffer = null;
//       ivBuffer = null;
//     }
//   })
// }
