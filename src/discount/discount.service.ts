import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import {
  errorCode,
  failCode,
  successCode,
  successCodeProduct,
} from 'src/Config/response';
import { CreateDiscountDto, NameDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class DiscountService {
  constructor() {}

  model = new PrismaClient();

  // ============================================
  //            GET ALL  DISCOUNT
  // ============================================
  async getAllDiscount(res: Response) {
    try {
      let data = await this.model.maGiam.findMany({
        where: {
          isDelete: false,
        },
      });

      if (data.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Chưa có mã giảm giá nào được thêm vào dữ liệu !',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:31 ~ DiscountService ~ getAllDiscount ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //      GET ALL DISCOUNT PAGINATION BY SEARCH
  // ============================================
  async getAllPagination(
    pageIndex: number,
    pageSize: number,
    search: string,
    res: Response,
  ) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, 'page và limit phải lớn hơn 0 !');
      }

      let index = (pageIndex - 1) * pageSize;

      // const currentDate = new Date();

      let total = await this.model.maGiam.findMany({
        where: {
          ma_giam_gia: {
            contains: search, // LIKE '%nameProduct%'
          },
          isDelete: false,
          // ngay_het_han: {
          //     gte: currentDate
          // },
        },
      });

      if (total.length === 0) {
        return successCode(
          res,
          total,
          200,
          'Không có dữ liệu mã giảm giá được tìm thấy !',
        );
      }

      let data = await this.model.maGiam.findMany({
        skip: +index, // Sử dụng skip thay vì offset
        take: +pageSize, // Sử dụng take thay vì limit
        where: {
          ma_giam_gia: {
            contains: search, // LIKE '%nameProduct%'
          },
          isDelete: false,
        },
      });

      if (data.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Không tìm thấy dữ liệu mã giảm giá bạn đang tìm !',
        );
      }

      successCodeProduct(res, data, 200, total.length, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:84 ~ DiscountService ~ getAllPagination ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //             GET DISCOUNT BY ID
  // ============================================
  async getById(id: number, res: Response) {
    try {
      let data = await this.model.maGiam.findFirst({
        where: {
          id: +id,
          isDelete: false,
        },
      });

      if (data === null) {
        return failCode(res, '', 400, 'Mã giảm ID không tồn tại');
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:109 ~ DiscountService ~ getById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //             GET DISCOUNT BY NAME
  // ============================================
  async getByName(ma_giam_gia: string, res: Response) {
    try {
      const currentDate = new Date();

      let data = await this.model.maGiam.findFirst({
        where: {
          ma_giam_gia,
          ngay_het_han: {
            gte: currentDate, // Kiểm tra nếu ngày hết hạn lớn hơn hoặc bằng ngày hiện tại
          },
          isDelete: false,
        },
      });

      if (data === null) {
        return failCode(
          res,
          '',
          400,
          'Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:139 ~ DiscountService ~ getByName ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               POST DISCOUNT
  // ============================================
  async postDiscount(body: CreateDiscountDto, res: Response) {
    try {
      let {
        ma_giam_gia,
        noi_dung,
        ap_dung_cho,
        loai,
        cu_the,
        gia_tri_giam,
        ngay_het_han,
      } = body;

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 7);

      let checkMagiam = await this.model.maGiam.findFirst({
        where: {
          ma_giam_gia,
          ap_dung_cho,
          loai,
          ngay_het_han: {
            gte: currentDate, // Kiểm tra nếu ngày hết hạn lớn hơn hoặc bằng ngày hiện tại
          },
          isDelete: false,
        },
      });

      if (checkMagiam !== null) {
        return failCode(res, checkMagiam, 400, 'Mã giảm giá đã tồn tại !');
      }

      let newDat = await this.model.maGiam.create({
        data: body,
      });

      successCode(res, newDat, 200, 'Thêm mã giảm giá mới thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:176 ~ DiscountService ~ postDiscount ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               PUT DISCOUNT
  // ============================================
  async putDiscountbyId(id: number, body: CreateDiscountDto, res: Response) {
    try {
      let {
        ma_giam_gia,
        noi_dung,
        ap_dung_cho,
        loai,
        cu_the,
        gia_tri_giam,
        ngay_het_han,
      } = body;

      let checkDiscountID = await this.model.maGiam.findFirst({
        where: {
          id: +id,
          ma_giam_gia,
          isDelete: false,
        },
      });

      if (checkDiscountID === null) {
        return failCode(
          res,
          '',
          400,
          'Dữ liệu mã giảm giá hoặc ID không đúng  !',
        );
      }

      await this.model.maGiam.update({
        where: {
          id: +id,
          ma_giam_gia,
          isDelete: false,
        },
        data: body,
      });

      successCode(res, body, 200, 'Cập nhật dữ liệu mã giảm giá thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:212 ~ DiscountService ~ putDiscountbyId ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //                DELETE DISCOUNT
  // ============================================
  async deleteOrderById(id: number, res: Response) {
    try {
      let data = await this.model.maGiam.findFirst({
        where: {
          id: +id,
          isDelete: false,
        },
      });

      if (data === null) {
        return failCode(
          res,
          data,
          400,
          'Mã giảm giá không tồn tại hoặc đã bị xóa trước đó !',
        );
      }

      await this.model.maGiam.update({
        where: {
          id: +id,
        },
        data: {
          isDelete: true,
        },
      });

      successCode(res, data, 200, 'Đã xóa mã giảm giá thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: discount.service.ts:245 ~ DiscountService ~ deleteOrderById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }
}
