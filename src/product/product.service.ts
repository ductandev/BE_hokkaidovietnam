import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode, successCodeProduct } from 'src/Config/response';

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
  // GET ALL PRODUCTS PAGINATION BY TYPE_ID SEARCH
  // ============================================
  async getAllProductsByTypeId(typeID: number, pageIndex: number, pageSize: number, search: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.sanPham.findMany({
          where: {
            ten_san_pham: {
              contains: search   // LIKE '%nameProduct%'
            },
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Chưa có sản phẩm nào được thêm vào dữ liệu")
        }

        let data = await this.model.sanPham.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            ten_san_pham: {
              contains: search   // LIKE '%nameProduct%'
            },
            isDelete: false
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu sản phẩm được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.sanPham.findMany({
        where: {
          loai_san_pham_id: +typeID,
          ten_san_pham: {
            contains: search   // LIKE '%nameProduct%'
          },
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu sản phẩm được tìm thấy !")
      }

      let data = await this.model.sanPham.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          ten_san_pham: {
            contains: search   // LIKE '%nameProduct%'
          },
          loai_san_pham_id: +typeID,
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCodeProduct(res, data, 200, total.length, "Không tìm thấy dữ liệu bạn đang tìm !")
      }

      successCodeProduct(res, data, 200, total.length, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product.service.ts:109 ~ ProductService ~ getAllProductsByTypeId ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //            GET ALL PRODUCT SUMARY
  // ============================================
  async getUserSummary(res: Response) {
    try {
      const totalProduct = await this.model.sanPham.findMany({
        where: {
          isDelete: false
        }
      });

      const totalTypeProduct = await this.model.loaiSanPham.findMany({
        where: {
          isDelete: false
        }
      });

      const content = {
        totalProduct: totalProduct.length,
        totalTypeProduct: totalTypeProduct.length
      }

      successCode(res, content, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:188 ~ OrderService ~ getOrderSummary ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //           GET PRODUCT BY ID
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
  //                POST PRODUCT  
  // ============================================
  async postProduct(files: Express.Multer.File[], body: CreateProductDto, res: Response) {
    try {
      let {
        loai_san_pham_id,
        ten_san_pham,
        gia_ban,
        gia_giam,
        mo_ta,
        thong_tin_chi_tiet,
        don_vi_tinh,
        trang_thai_san_pham = true,
        so_luong_trong_kho,
        san_pham_noi_bat = false,
        san_pham_lien_quan = [] } = body;

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


      if (typeof san_pham_lien_quan === 'string' && san_pham_lien_quan !== '') {
        san_pham_lien_quan = JSON.parse(san_pham_lien_quan);
      }

      let newData = await this.model.sanPham.create({
        data: {
          loai_san_pham_id: +loai_san_pham_id,
          ten_san_pham,
          gia_ban: +gia_ban,
          gia_giam: +gia_giam,
          mo_ta,
          thong_tin_chi_tiet,
          don_vi_tinh,
          trang_thai_san_pham: Boolean(trang_thai_san_pham),
          so_luong_trong_kho: +so_luong_trong_kho,
          san_pham_noi_bat: Boolean(san_pham_noi_bat),
          san_pham_lien_quan,
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
