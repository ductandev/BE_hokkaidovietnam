import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode, successCodeProduct } from 'src/Config/response';


import { CreateNewsDto } from './dto/create-news.dto';
import { Response } from 'express';

// =================CLOUDYNARY=====================
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
const streamifier = require('streamifier');


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
      console.log("🚀 ~ file: news.service.ts:39 ~ NewsService ~ getAllNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //        GET PANIGATION LIST NEWS
  // ============================================
  async getPanigationNews(pageIndex: number, pageSize: number, search: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }
      let index = (pageIndex - 1) * pageSize;

      let total = await this.model.tinTuc.findMany({
        where: {
          tieu_de: {
            contains: search   // LIKE '%nameProduct%'
          },
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu tin tức được tìm thấy !")
      }

      let data = await this.model.tinTuc.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          tieu_de: {
            contains: search    // LIKE '%nameProduct%'
          },
          isDelete: false,
        },
        orderBy: {
          tin_tuc_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
        }
      });

      if (data.length === 0) {
        return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu Tin tức nào được tìm thấy !")
      }

      successCodeProduct(res, data, 200, total.length, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:69 ~ NewsService ~ getPanigationNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           GET NAME NEWS BY ID
  // ============================================ 
  async getNewsById(id: number, res: Response) {
    try {
      let data = await this.model.tinTuc.findFirst({
        where: {
          tin_tuc_id: +id,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, "Tin tức ID không tồn tại hoặc đã được xóa trước đó !")
      }

      successCode(res, data, 200, "Thành công")
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:93 ~ NewsService ~ getNewsById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //            GET NEWS BY NAME
  // ============================================ 
  async getNameNews(name: string, res: Response) {
    try {
      let data = await this.model.tinTuc.findMany({
        where: {
          tieu_de: {
            contains: name   // LIKE '%nameProduct%'
          },
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Không có dữ liệu kết quả tìm kiếm !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:119 ~ NewsService ~ getNameNews ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  }

  // ============================================
  //           POST UPLOAD NEWS
  // ============================================
  async postNews(file: Express.Multer.File, body: CreateNewsDto, res: Response) {
    try {
      let { tieu_de, mo_ta, noi_dung, bai_viet_lien_quan } = body

      let data = await this.model.tinTuc.findFirst({
        where: {
          tieu_de,
          isDelete: false
        }
      })

      if (data !== null) {
        return failCode(res, '', 400, "Tiêu đề bài viết đã tồn tại !");
      }

      if (!file || !file.buffer) {
        return failCode(res, '', 400, "Dữ liệu file không hợp lệ !");
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

      if (typeof bai_viet_lien_quan === 'string') {
        bai_viet_lien_quan = JSON.parse(bai_viet_lien_quan);
      }

      const newData = await this.model.tinTuc.create({
        data: {
          tieu_de,
          mo_ta,
          noi_dung,
          bai_viet_lien_quan,
          hinh_anh: dataCloudinary.secure_url
        },
      });

      successCode(res, newData, 201, 'Thêm tin tức thành công !');
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:194 ~ NewsService ~ postNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           PUT UPLOAD NEWS
  // ============================================
  async putNews(file: Express.Multer.File, id: number, body: CreateNewsDto, res: Response) {
    try {
      let { tieu_de, mo_ta, noi_dung, bai_viet_lien_quan = [] } = body

      let data = await this.model.tinTuc.findFirst({
        where: {
          tin_tuc_id: +id,
          isDelete: false
        }
      })

      if (data === null) {
        return failCode(res, '', 400, "Bài viết id không tồn tại !");
      }

      if (!file || !file.buffer) {
        return failCode(res, '', 400, "Dữ liệu file không hợp lệ !");
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

      if (typeof bai_viet_lien_quan === 'string') {
        bai_viet_lien_quan = JSON.parse(bai_viet_lien_quan);
      }

      const newData = await this.model.tinTuc.update({
        where: {
          tin_tuc_id: +id,
          isDelete: false
        },
        data: {
          tieu_de,
          mo_ta,
          noi_dung,
          bai_viet_lien_quan,
          hinh_anh: dataCloudinary.secure_url        // Lấy ra array URL
        },
      });

      successCode(res, newData, 200, 'Cập nhật tin tức thành công !');
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:237 ~ NewsService ~ putNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //                DELETE NEWS
  // ============================================
  async deleteNews(id: number, res: Response) {
    try {
      let checkNewsID = await this.model.tinTuc.findFirst({
        where: {
          tin_tuc_id: +id,
          isDelete: false
        }
      });

      if (checkNewsID === null) {
        return failCode(res, checkNewsID, 400, "News ID không tồn tại hoặc đã bị xóa trước đó !")
      }

      await this.model.tinTuc.update({
        where: {
          tin_tuc_id: +id
        },
        data: {
          isDelete: true
        }
      });

      successCode(res, checkNewsID, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: news.service.ts:270 ~ NewsService ~ deleteNews ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }
}
