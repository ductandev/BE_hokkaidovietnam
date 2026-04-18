import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor() {}

  model = new PrismaClient();

  // ============================================
  //            GET ALL "ORDER-DETAIL"
  // ============================================
  async getAllOrderDetail(res: Response) {
    try {
      let data = await this.model.chiTietDonHang.findMany({
        where: {
          isDelete: false,
        },
      });

      if (data.length === 0) {
        return successCode(
          res,
          data,
          200,
          'Chưa có chi tiết đơn hàng nào được thêm vào dữ liệu',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: order-detail.service.ts:34 ~ OrderDetailService ~ getAllOrderDetail ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //       GET DETAIL "ORDER-DETAIL" BY ID
  // ============================================
  async getOrderDetailById(id: number, res: Response) {
    try {
      let data = await this.model.chiTietDonHang.findFirst({
        where: {
          id: +id,
          isDelete: false,
        },
        include: {
          // DonHang: {
          //   include: {
          //     NguoiDung: true
          //   }
          // },
          SanPham: true,
        },
      });

      if (data === null) {
        return successCode(
          res,
          data,
          200,
          'OrderDetailID không tồn tại hoặc đã bị xóa trước đó !',
        );
      }

      successCode(res, data, 200, 'Thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: order-detail.service.ts:66 ~ OrderDetailService ~ getOrderDetailById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               POST "ORDER-DETAIL"
  // ============================================
  async postOrderDetail(body: CreateOrderDetailDto, res: Response) {
    try {
      let { don_hang_id } = body;

      if (don_hang_id === undefined) {
        return failCode(
          res,
          '',
          400,
          'Dữ liệu đầu vào không đúng định dạng, Vui lòng kiểm tra lại !',
        );
      }

      let checkOrderDetail = await this.model.donHang.findFirst({
        where: {
          don_hang_id,
          isDelete: false,
        },
      });

      if (checkOrderDetail === null) {
        return failCode(
          res,
          checkOrderDetail,
          409,
          'Đơn hàng ID không tồn tại hoặc đã bị xóa trước đó, vui lòng kiểm tra lại !',
        );
      }

      let data = await this.model.chiTietDonHang.create({
        data: body,
      });

      successCode(res, data, 200, 'Thêm chi tiết đơn hàng mới thành công !');
    } catch (exception) {
      console.log(
        '🚀 ~ file: order-detail.service.ts:162 ~ OrderDetailService ~ postOrderDetail ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //               PUT "ORDER-DETAIL"
  // ============================================
  async putOrderDetailById(
    id: number,
    body: CreateOrderDetailDto,
    res: Response,
  ) {
    try {
      let { don_hang_id } = body;

      if (don_hang_id === undefined) {
        return failCode(
          res,
          '',
          400,
          'Dữ liệu đầu vào không đúng định dạng, Vui lòng kiểm tra lại !',
        );
      }

      let checkOrderDetail = await this.model.chiTietDonHang.findFirst({
        where: {
          id: +id,
          don_hang_id,
          isDelete: false,
        },
      });

      if (checkOrderDetail === null) {
        return failCode(
          res,
          checkOrderDetail,
          400,
          "Không tìm thấy 'Chi tiết đơn hàng', vui lòng kiểm tra lại ID và Order_ID !",
        );
      }

      let data = await this.model.chiTietDonHang.update({
        where: {
          id: +id,
          don_hang_id,
        },
        data: body,
      });

      successCode(res, data, 200, "Cập nhật 'Chi tiết đơn hàng' thành công !");
    } catch (exception) {
      console.log(
        '🚀 ~ file: order-detail.service.ts:201 ~ OrderDetailService ~ putOrderDetailById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }

  // ============================================
  //                DELETE "ORDER-DETAIL"
  // ============================================
  async deleteOrderDetailById(id: number, res: Response) {
    try {
      let data = await this.model.chiTietDonHang.findFirst({
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
          "'Chi tiết đơn hàng ID' không tồn tại hoặc đã bị xóa trước đó !",
        );
      }

      await this.model.chiTietDonHang.update({
        where: {
          id: +id,
        },
        data: {
          isDelete: true,
        },
      });

      successCode(res, data, 200, "Đã xóa 'Chi tiết đơn hàng' thành công !");
    } catch (exception) {
      console.log(
        '🚀 ~ file: order-detail.service.ts:235 ~ OrderDetailService ~ deleteOrderDetailById ~ exception:',
        exception,
      );
      errorCode(res, 'Lỗi BE');
    }
  }
}
