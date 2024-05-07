import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode } from 'src/Config/response';


import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Response } from 'express';


@Injectable()
export class NewsService {
  model = new PrismaClient();


  // ============================================
  //                GET ALL NEWS
  // ============================================
  async getAllNews(res: Response) {
    try {
      let data = await this.model.tinTuc.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Chưa có tin tức nào được thêm vào dữ liệu!")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:34 ~ NewsService ~ getAllNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //        GET PANIGATION LIST NEWS
  // ============================================
  async getPanigationNews(pageIndex: number, pageSize: number, res: Response) {
    try {
      let index = (pageIndex - 1) * pageSize;
      if (index < 0) {
        return failCode(res, '', 400, "PageIndex phải lớn hơn 0 !")
      };

      let data = await this.model.tinTuc.findMany({
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
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           GET NAME NEWS BY ID
  // ============================================ 
  async getNewsById(id: number, res: Response) {
    try {
      let data = await this.model.banner.findFirst({
        where: {
          banner_id: +id,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, "Banner ID không tồn tại hoặc đã được xóa trước đó !")
      }

      successCode(res, data, 200, "Thành công")
    }
    catch (exception) {
      errorCode(res, "Lỗi BE")
    }
  }

  // // ============================================
  // //           POST UPLOAD IMG NEWS
  // // ============================================
  // async postImgBanner(file: Express.Multer.File, body: FileUploadDto_banner, res: Response) {
  //   try {
  //     let { email } = body

  //     if (email === undefined) {
  //       return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
  //     }

  //     let checkUser = await this.model.nguoiDung.findFirst({
  //       where: {
  //         email,
  //         isDelete: false
  //       },
  //     });

  //     if (checkUser === null) {
  //       return failCode(res, '', 400, "Email người dùng không tồn tại !");
  //     }

  //     // ⭐****************** CLOUDINARY **************************⭐
  //     // const uploadPromises = files.map((file) => {
  //     //   return new Promise<CloudinaryResponse>((resolve, reject) => {
  //     //     const uploadStream = cloudinary.uploader.upload_stream(
  //     //       (error, result) => {
  //     //         if (error) return reject(error);
  //     //         resolve(result);
  //     //       },
  //     //     );
  //     //     streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //     //   });
  //     // });

  //     // const dataCloudinaryArray = await Promise.all(uploadPromises);
  //     // console.log(dataCloudinaryArray)


  //     const dataCloudinary = await new Promise<CloudinaryResponse>((resolve, reject) => {
  //       const uploadStream = cloudinary.uploader.upload_stream(
  //         (error, result) => {
  //           if (error) return reject(error);
  //           resolve(result);
  //         },
  //       );
  //       streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //     });
  //     // console.log(dataCloudinary.url)
  //     // ************************ END *****************************


  //     await this.model.banner.create({
  //       data: {
  //         // ten_hinh_anh: dataCloudinaryArray.map(item => item.url),        // Lấy ra array URL
  //         url_banner: dataCloudinary.url
  //       },
  //     });

  //     successCode(res, dataCloudinary, 201, 'Thêm ảnh Banner thành công !');
  //   }
  //   catch (exception) {
  //     console.log("🚀 ~ file: banner.service.ts:159 ~ BannerService ~ postImgBanner ~ exception:", exception);
  //     errorCode(res, "Lỗi BE")
  //   }
  // }

  // // ============================================
  // //           PUT UPLOAD IMG NEWS
  // // ============================================
  // async putImgBanner(file: Express.Multer.File, id: number, body: FileUploadDto_banner, res: Response) {
  //   try {
  //     let { email } = body

  //     if (email === undefined) {
  //       return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
  //     }

  //     let checkUser = await this.model.nguoiDung.findFirst({
  //       where: {
  //         email,
  //         isDelete: false
  //       },
  //     });

  //     if (checkUser === null) {
  //       return failCode(res, '', 400, "Email người dùng không tồn tại !");
  //     }

  //     let checkBannerID = await this.model.banner.findFirst({
  //       where: {
  //         banner_id: +id,
  //         isDelete: false
  //       },
  //     });

  //     if (checkBannerID === null) {
  //       return failCode(res, '', 400, "Banner ID không tồn tại !");
  //     }

  //     // ⭐****************** CLOUDINARY **************************⭐
  //     const dataCloudinary = await new Promise<CloudinaryResponse>((resolve, reject) => {
  //       const uploadStream = cloudinary.uploader.upload_stream(
  //         (error, result) => {
  //           if (error) return reject(error);
  //           resolve(result);
  //         },
  //       );
  //       streamifier.createReadStream(file.buffer).pipe(uploadStream);
  //     });
  //     // console.log(dataCloudinary.url)
  //     // ************************ END *****************************


  //     await this.model.banner.update({
  //       where: {
  //         banner_id: +id,
  //         isDelete: false
  //       },
  //       data: {
  //         url_banner: dataCloudinary.url        // Lấy ra array URL
  //       },
  //     });

  //     successCode(res, dataCloudinary, 200, 'Cập nhật ảnh Banner thành công !');
  //   }
  //   catch (exception) {
  //     console.log("🚀 ~ file: banner.service.ts:224 ~ BannerService ~ putImgBanner ~ exception:", exception);
  //     errorCode(res, "Lỗi BE")
  //   }
  // }

  // // ============================================
  // //                DELETE IMG NEWS
  // // ============================================
  // async deleteBanner(id: number, res: Response) {
  //   try {
  //     let checkBannerID = await this.model.banner.findFirst({
  //       where: {
  //         banner_id: +id,
  //         isDelete: false
  //       }
  //     });

  //     if (checkBannerID === null) {
  //       return failCode(res, checkBannerID, 400, "Room ID không tồn tại hoặc đã bị xóa trước đó !")
  //     }

  //     await this.model.banner.update({
  //       where: {
  //         banner_id: +id
  //       },
  //       data: {
  //         isDelete: true
  //       }
  //     });

  //     successCode(res, checkBannerID, 200, "Thành công !")
  //   }
  //   catch (exception) {
  //     console.log("🚀 ~ file: banner.service.ts:257 ~ BannerService ~ deleteBanner ~ exception:", exception);
  //     errorCode(res, "Lỗi BE")
  //   }
  // }



}
