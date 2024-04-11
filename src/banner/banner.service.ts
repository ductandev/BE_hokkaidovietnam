import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode } from 'src/Config/response';

import { Response } from 'express';
import { FileUploadDto_banner } from './dto/upload.dto';

// =================CLOUDYNARY=====================
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
const streamifier = require('streamifier');


@Injectable()
export class BannerService {
  constructor() { }

  model = new PrismaClient();

  // ============================================
  //            GET ALL BANNER
  // ============================================ 
  async getAllBanner(res: Response) {
    try {
      let data = await this.model.banner.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Chưa có banner nào được thêm vào !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:30 ~ BannerService ~ getAllBanner ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  }

  // ============================================
  //           GET NAME BANNER BY ID
  // ============================================ 
  async getBannerById(bannerID: number, res: Response) {
    try {
      let data = await this.model.banner.findFirst({
        where: {
          banner_id: +bannerID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, "Banner ID không tồn tại hoặc đã được xóa trước đó !")
      }

      successCode(res, data, 200, "Thành công")
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:62 ~ BannerService ~ getBannerById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //        GET PANIGATION LIST BANNER
  // ============================================
  async getPanigationBanner(pageIndex: number, pageSize: number, res: Response) {
    try {
      let index = (pageIndex - 1) * pageSize;
      if (index < 0) {
        return failCode(res, '', 400, "PageIndex phải lớn hơn 0 !")
      };

      let data = await this.model.banner.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          isDelete: false,
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Không có dữ liệu Banner nào được tìm thấy !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:92 ~ BannerService ~ getPanigationBanner ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           POST UPLOAD IMG BANNER
  // ============================================
  async postImgBanner(file: Express.Multer.File, body: FileUploadDto_banner, res: Response) {
    try {
      let { email } = body

      if (email === undefined) {
        return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
      }

      let checkUser = await this.model.nguoiDung.findFirst({
        where: {
          email,
          isDelete: false
        },
      });

      if (checkUser === null) {
        return failCode(res, '', 400, "Email người dùng không tồn tại !");
      }

      // ⭐****************** CLOUDINARY **************************⭐
      // const uploadPromises = files.map((file) => {
      //   return new Promise<CloudinaryResponse>((resolve, reject) => {
      //     const uploadStream = cloudinary.uploader.upload_stream(
      //       (error, result) => {
      //         if (error) return reject(error);
      //         resolve(result);
      //       },
      //     );
      //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
      //   });
      // });

      // const dataCloudinaryArray = await Promise.all(uploadPromises);
      // console.log(dataCloudinaryArray)


      const dataCloudinary = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
      // console.log(dataCloudinary.url)
      // ************************ END *****************************


      await this.model.banner.create({
        data: {
          // ten_hinh_anh: dataCloudinaryArray.map(item => item.url),        // Lấy ra array URL
          ten_hinh_anh: dataCloudinary.url
        },
      });

      successCode(res, dataCloudinary, 201, 'Thêm ảnh Banner thành công !');
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:159 ~ BannerService ~ postImgBanner ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           PUT UPLOAD IMG BANNER
  // ============================================
  async putImgBanner(file: Express.Multer.File, bannerID: number, body: FileUploadDto_banner, res: Response) {
    try {
      let { email } = body

      if (email === undefined) {
        return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
      }

      let checkUser = await this.model.nguoiDung.findFirst({
        where: {
          email,
          isDelete: false
        },
      });

      if (checkUser === null) {
        return failCode(res, '', 400, "Email người dùng không tồn tại !");
      }

      let checkBannerID = await this.model.banner.findFirst({
        where: {
          banner_id: +bannerID,
          isDelete: false
        },
      });

      if (checkBannerID === null) {
        return failCode(res, '', 400, "Banner ID không tồn tại !");
      }

      // ⭐****************** CLOUDINARY **************************⭐
      const dataCloudinary = await new Promise<CloudinaryResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
      // console.log(dataCloudinary.url)
      // ************************ END *****************************


      await this.model.banner.update({
        where: {
          banner_id: +bannerID,
          isDelete: false
        },
        data: {
          ten_hinh_anh: dataCloudinary.url        // Lấy ra array URL
        },
      });

      successCode(res, dataCloudinary, 200, 'Cập nhật ảnh Banner thành công !');
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:224 ~ BannerService ~ putImgBanner ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //                DELETE IMG BANNER
  // ============================================
  async deleteBanner(bannerID: number, res: Response) {
    try {
      let checkBannerID = await this.model.banner.findFirst({
        where: {
          banner_id: +bannerID,
          isDelete: false
        }
      });

      if (checkBannerID === null) {
        return failCode(res, checkBannerID, 400, "Room ID không tồn tại hoặc đã bị xóa trước đó !")
      }

      await this.model.banner.update({
        where: {
          banner_id: +bannerID
        },
        data: {
          isDelete: true
        }
      });

      successCode(res, checkBannerID, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: banner.service.ts:257 ~ BannerService ~ deleteBanner ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


}
