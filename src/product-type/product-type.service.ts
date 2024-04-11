import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { CreateProductTypeDto } from './dto/create-product-type.dto';

@Injectable()
export class ProductTypeService {
  constructor() { }

  model = new PrismaClient();


  // ============================================
  //            GET ALL TYPE PRODUCTS
  // ============================================ 
  async getAllProductType(res: Response) {
    try {
      let data = await this.model.loaiSanPham.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Chưa có loại sản phẩm nào được thêm vào dữ liệu")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:33 ~ ProductTypeService ~ getAllProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //       GET NAME PRODUCT TYPE BY ID
  // ============================================ 
  async getProductTypeById(productTypeID: number, res: Response) {
    try {
      let data = await this.model.loaiSanPham.findFirst({
        where: {
          loai_san_pham_id: +productTypeID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, '', 404, "Loại sản phẩm ID không tồn tại")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:57 ~ ProductTypeService ~ getProductTypeById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //       GET PRODUCT TYPE BY NAME
  // ============================================ 
  async getNameProductType(nameProductType: string, res: Response) {
    try {
      let data = await this.model.loaiSanPham.findMany({
        where: {
          ten_loai_san_pham: {
            contains: nameProductType   // LIKE '%nameProductType%'
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
      console.log("🚀 ~ file: product-type.service.ts:83 ~ ProductTypeService ~ getNameProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  }

  // ============================================
  //      GET PANIGATION LIST PRODUCT TYPE
  // ============================================
  async getPanigationProductType(pageIndex: number, pageSize: number, res: Response) {
    try {
      let index = (pageIndex - 1) * pageSize;
      if (index < 0) {
        return failCode(res, '', 400, "PageIndex phải lớn hơn 0 !")
      };

      let data = await this.model.loaiSanPham.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          isDelete: false,
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Không có dữ liệu loại sản phẩm nào được tìm thấy !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:113 ~ ProductTypeService ~ getPanigationProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //            POST PRODUCT TYPE 
  // ============================================
  async postProductType(body: CreateProductTypeDto, res: Response) {
    try {
      let { ten_loai_san_pham } = body;

      if (ten_loai_san_pham === undefined) {
        return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
      }

      let data = await this.model.loaiSanPham.findFirst({
        where: {
          ten_loai_san_pham,
          isDelete: false
        }
      })

      if (data !== null) {
        return failCode(res, data, 409, "Loại sản phẩm này đã tồn tại !")
      }

      await this.model.loaiSanPham.create({
        data: body
      })

      successCode(res, body, 201, "Thêm loại sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:147 ~ ProductTypeService ~ postProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //             PUT PRODUCT TYPE 
  // ============================================
  async putProductType(productTypeID: number, body: CreateProductTypeDto, res: Response) {
    try {
      let { ten_loai_san_pham } = body;

      if (ten_loai_san_pham === undefined) {
        return failCode(res, "", 400, "Dữ liệu đầu vào không đúng định dạng !")
      }

      let data = await this.model.loaiSanPham.findFirst({
        where: {
          loai_san_pham_id: +productTypeID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, data, 400, "Loại sản phẩm ID không tồn tại !")
      }

      let newData = await this.model.loaiSanPham.update({
        where: {
          loai_san_pham_id: +productTypeID,
        },
        data: body
      })

      successCode(res, newData, 200, "Cập nhật tên loại sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:184 ~ ProductTypeService ~ putProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  }

  // ============================================
  //            DELETE PRODUCT TYPE 
  // ============================================
  async deleteProductType(productTypeID: number, res: Response) {
    try {
      let data = await this.model.loaiSanPham.findFirst({
        where: {
          loai_san_pham_id: +productTypeID,
          isDelete: false
        }
      });


      if (data === null) {
        return failCode(res, data, 400, "Loại sản phẩm ID không tồn tại !")
      }

      await this.model.loaiSanPham.update({
        where: {
          loai_san_pham_id: +productTypeID
        },
        data: {
          isDelete: true
        }
      })

      successCode(res, data, 200, "Xóa loại sản phẩm thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: product-type.service.ts:218 ~ ProductTypeService ~ deleteProductType ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


}
