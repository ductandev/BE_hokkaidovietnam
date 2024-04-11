import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode } from 'src/Config/response';
import { CreateOrderDto } from './dto/create-order.dto';


@Injectable()
export class OrderService {
  constructor() { }

  model = new PrismaClient();


  // ============================================
  //            GET ALL ORDER
  // ============================================ 
  async getAllOrder(res: Response) {
    try {
      let data = await this.model.donHang.findMany({
        where: {
          isDelete: false
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Chưa có đơn hàng nào được thêm vào dữ liệu")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:34 ~ OrderService ~ getAllOrder ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //             GET ORDER BY ID
  // ============================================ 
  async getOrderById(orderID: number, res: Response) {
    try {
      let data = await this.model.donHang.findFirst({
        where: {
          don_hang_id: +orderID,
          isDelete: false
        }
      });

      if (data === null) {
        return failCode(res, '', 400, "đơn hàng ID không tồn tại")
      }

      successCode(res, data, 200, "Thành công !")

    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:59 ~ OrderService ~ getOrderById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //             GET ORDER BY USER ID
  // ============================================ 
  async getOrderByUserId(userID: number, res: Response) {
    try {
      let checkUserID = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userID,
          isDelete: false
        }
      })

      if (checkUserID === null) {
        return failCode(res, checkUserID, 400, "Người dùng ID không tồn tại !")
      }

      let data = await this.model.donHang.findMany({
        where: {
          nguoi_dung_id: +userID,
          isDelete: false
        }
      });

      if (data.length === 0) {
        return failCode(res, '', 400, "Người dùng này chưa đặt bất kì đơn hàng nào !")
      }

      successCode(res, data, 200, "Thành công !")

    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:95 ~ OrderService ~ getOrderByUserId ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //        GET PANIGATION LIST ORDER
  // ============================================
  async getPanigationOrder(pageIndex: number, pageSize: number, res: Response) {
    try {
      let index = (pageIndex - 1) * pageSize;
      if (index < 0) {
        return failCode(res, '', 400, "PageIndex phải lớn hơn 0 !")
      };

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          isDelete: false,
        }
      });

      if (data.length === 0) {
        return successCode(res, data, 200, "Không có dữ liệu đơn hàng nào được tìm thấy !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:125 ~ OrderService ~ getPanigationOrder ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //               POST ORDER
  // ============================================
  async postOrder(body: CreateOrderDto, res: Response) {
    try {
      let { so_phieu } = body;

      let checkOrder = await this.model.donHang.findFirst({
        where: {
          so_phieu,
          trang_thai_dat_hang: true,
          isDelete: false
        }
      });

      if (checkOrder !== null) {
        return failCode(res, checkOrder, 409, "Đơn hàng này đã được đặt trước đó, vui lòng kiểm tra lại !")
      }

      let data = await this.model.donHang.create({
        data: body
      })

      successCode(res, data, 200, "Thêm đơn hàng mới thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:156 ~ OrderService ~ postOrder ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //               PUT ORDER
  // ============================================
  async putOrderById(orderID: number, body: CreateOrderDto, res: Response) {
    try {

      let checkOrder = await this.model.donHang.findFirst({
        where: {
          don_hang_id: +orderID,
          isDelete: false
        }
      });

      if (checkOrder === null) {
        return failCode(res, checkOrder, 400, "Không tìm thấy đơn hàng, vui lòng kiểm tra lại thông tin")
      }

      let data = await this.model.donHang.update({
        where: {
          don_hang_id: +orderID
        },
        data: body
      })

      successCode(res, data, 200, "Cập nhật đơn hàng thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:188 ~ OrderService ~ putOrderById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //                DELETE ORDER  
  // ============================================
  async deleteOrderById(orderID: number, res: Response) {
    try {
      let data = await this.model.donHang.findFirst({
        where: {
          don_hang_id: +orderID,
          isDelete: false
        },
      });

      if (data === null) {
        return failCode(res, data, 400, "Đơn hàng ID không tồn tại hoặc đã bị xóa trước đó !")
      }

      await this.model.donHang.update({
        where: {
          don_hang_id: +orderID,
        },
        data: {
          isDelete: true
        }
      });

      successCode(res, data, 200, "Đã xóa đơn hàng thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:222 ~ OrderService ~ deleteOrderById ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


}
