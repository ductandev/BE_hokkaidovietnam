import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode } from 'src/Config/response';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// =================CLOUDYNARY=====================
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from '../cloudinary/cloudinary-response';
const streamifier = require('streamifier');


@Injectable()
export class ProductService {
  constructor() { }

  model = new PrismaClient();


  // ============================================
  //            GET ALL  PRODUCTS
  // ============================================ 
  async getAllProducts(res: Response) {
    try {
      let data = await this.model.sanPham.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Chưa có sản phẩm nào được thêm vào dữ liệu")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:33 ~ ProductService ~ getAllProducts ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           GET NAME PRODUCT BY ID
  // ============================================ 
  async getProductById(productID: number, res: Response) {
    try {
      let data = await this.model.sanPham.findFirst({
        where: {
          san_pham_id: +productID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, '', 404, "Sản phẩm ID không tồn tại")
      }

      successCode(res, data, 200, "Thành công !")

    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:58 ~ ProductService ~ getProductById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //            GET PRODUCT BY NAME
  // ============================================ 
  async getNameProduct(nameProduct: string, res: Response) {
    try {
      let data = await this.model.sanPham.findMany({
        where: {
          ten_san_pham: {
            contains: nameProduct   // LIKE '%nameProduct%'
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
      console.log("🚀 ~ file: product.service.ts:91 ~ ProductService ~ getNameProduct ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  }


  // ============================================
  //         GET PANIGATION LIST PRODUCT
  // ============================================
  async getPanigationProduct(pageIndex: number, pageSize: number, res: Response) {
    try {
      let index = (pageIndex - 1) * pageSize;
      if (index < 0) {
        return failCode(res, '', 400, "pageIndex phải lớn hơn 0 !")
      };

      let data = await this.model.sanPham.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          isDelete: false,
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Không có dữ liệu sản phẩm nào được tìm thấy !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:123 ~ ProductService ~ getPanigationRoom ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


  // ============================================
  //                POST PRODUCT  
  // ============================================
  async postProduct(files: Express.Multer.File[], body: CreateProductDto, res: Response) {
    try {
      let { loai_san_pham_id, ten_san_pham, gia_ban, gia_giam, mo_ta_chi_tiet, don_vi_tinh, so_luong_trong_kho } = body;

      let data = await this.model.sanPham.findFirst({
        where: {
          ten_san_pham,
          loai_san_pham_id: +loai_san_pham_id,
          isDelete: false
        }
      })

      if (data !== null) {
        return failCode(res, data, 409, "Sản phẩm này đã tồn tại !")
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
      // console.log(dataCloudinaryArray)
      // ************************ END *****************************


      let newData = await this.model.sanPham.create({
        data: {
          loai_san_pham_id: +loai_san_pham_id,
          ten_san_pham,
          gia_ban: +gia_ban,
          gia_giam: +gia_giam,
          mo_ta_chi_tiet,
          don_vi_tinh,
          so_luong_trong_kho: +so_luong_trong_kho,
          hinh_anh: dataCloudinaryArray.map(item => item.url),        // Lấy ra array URL
        }
      })

      successCode(res, newData, 201, "Thêm sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:182 ~ ProductService ~ postProduct ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


  // ============================================
  //             PUT PRODUCT INFO
  // ============================================
  async putProduct(productID: number, body: UpdateProductDto, res: Response) {
    try {
      let data = await this.model.sanPham.findFirst({
        where: {
          san_pham_id: +productID,
          isDelete: false
        }
      })

      if (data === null) {
        return failCode(res, data, 400, "Sản phẩm ID này không tồn tại !")
      }

      let newData = await this.model.sanPham.update({
        where: {
          san_pham_id: +productID,
          isDelete: false
        },
        data: body
      })

      successCode(res, newData, 200, "Cập nhật sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:215 ~ ProductService ~ putProduct ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //             PUT PRODUCT IMAGE
  // ============================================
  async putProductImg(files: Express.Multer.File[], productID: number, body: CreateProductDto, res: Response) {
    try {
      let data = await this.model.sanPham.findFirst({
        where: {
          san_pham_id: +productID,
          isDelete: false
        }
      })

      if (data === null) {
        return failCode(res, data, 400, "Sản phẩm ID này không tồn tại !")
      }

      if (files.length === 0) {
        return failCode(res, "", 400, "Không có hình ảnh để cập nhật, vui lòng thêm hình ảnh !")
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
      // console.log(dataCloudinaryArray)
      // ************************ END *****************************

      let newData = await this.model.sanPham.update({
        where: {
          san_pham_id: +productID,
          isDelete: false
        },
        data: {
          hinh_anh: dataCloudinaryArray?.map(item => item.url),        // Lấy ra array URL
        }
      })

      successCode(res, newData, 200, "Cập nhật sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:270 ~ ProductService ~ putProductImg ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


  // ============================================
  //               DELETE PRODUCT  
  // ============================================
  async deleteProduct(productID: number, res: Response) {
    try {
      let data = await this.model.sanPham.findFirst({
        where: {
          san_pham_id: +productID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, " sản phẩm ID không tồn tại !")
      }

      await this.model.sanPham.update({
        where: {
          san_pham_id: +productID
        },
        data: {
          isDelete: true
        }
      })

      successCode(res, data, 200, "Xóa  sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:304 ~ ProductService ~ deleteProduct ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

}
