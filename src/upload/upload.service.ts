import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import {
  errorCode,
  failCode,
  successCode,
  successCodeProduct,
} from 'src/Config/response';

import { FileUploadDto_upload } from './dto/upload.dto';

// =================CLOUDYNARY=====================
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class UploadService {
  // ============================================
  //             PUT PRODUCT IMAGE
  // ============================================
  async postImgs(
    files: Express.Multer.File[],
    body: FileUploadDto_upload,
    res: Response,
  ) {
    try {
      if (files.length === 0) {
        return failCode(
          res,
          '',
          400,
          'Không có hình ảnh để cập nhật, vui lòng thêm hình ảnh !',
        );
      }

      // ⭐****************** CLOUDINARY **************************⭐
      const uploadPromises = files.map((file) => {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const dataCloudinaryArray = await Promise.all(uploadPromises);
      console.log(dataCloudinaryArray);
      // ************************ END *****************************

      const content = {
        hinh_anh: dataCloudinaryArray?.map((item) => item.url), // Lấy ra array URL
      };

      successCode(res, content, 200, 'Cập nhật sản phẩm thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: product.service.ts:270 ~ ProductService ~ putProductImg ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }
}
