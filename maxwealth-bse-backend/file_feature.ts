import { BadRequestException, HttpStatus } from "@nestjs/common";
import { extname } from "path";

export const editFileName = (req, file, callback) => {
    const nam = file.originalname.split(".")[0].split(" ");
    const name = nam.join("_");
    console.log("Document Name:", name);
    console.log("File", file.originalname);
    const fileExtName = extname(file.originalname);
    console.log("File extension", fileExtName);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };


  export const fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(csv|xlsx|xls)$/)) {
      return callback(
        new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Only CSV and Excel files are allowed!',
        }),
        false
      );
    }
    callback(null, true);
  };

  export const FileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(txt|pdf|doc)$/)) {
        return callback(new BadRequestException({ status: HttpStatus.BAD_REQUEST, error: 'Only image and pdf files are allowed!' }), false);
    }
    callback(null, true);
};
