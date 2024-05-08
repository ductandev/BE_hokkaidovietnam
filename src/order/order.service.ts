import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode, successCodeProduct } from 'src/Config/response';
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
        },
        include: {
          HinhThucThanhToan: true,
          TrangThaiDonHang: true,
          NguoiDung: true
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
  //      GET ALL ORDER PAGINATION BY SEARCH
  // ============================================
  async getAllPagination(typeID: number, pageIndex: number, pageSize: number, search: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            ho_ten: {
              contains: search   // LIKE '%nameProduct%'
            },
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy người dùng có tên này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            ho_ten: {
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

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          ho_ten: {
            contains: search   // LIKE '%nameProduct%'
          },
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu sản phẩm được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          ho_ten: {
            contains: search   // LIKE '%nameProduct%'
          },
          trang_thai_don_hang_id: +typeID,
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
  //             GET ORDER BY ID
  // ============================================ 
  async getOrderById(id: number, res: Response) {
    try {
      let data = await this.model.donHang.findFirst({
        where: {
          don_hang_id: +id,
          isDelete: false
        },
        include: {
          HinhThucThanhToan: true,
          TrangThaiDonHang: true,
          NguoiDung: true
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
  async getOrderByUserId(phone: string, res: Response) {
    try {
      let checkUserPhone = await this.model.nguoiDung.findFirst({
        where: {
          so_dien_thoai: phone,
          isDelete: false
        },
        include: {
          DonHang: true
        }
      })

      if (checkUserPhone === null) {
        return failCode(res, checkUserPhone, 400, "Người dùng ID không tồn tại !")
      }

      successCode(res, checkUserPhone, 200, "Thành công !")

    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:95 ~ OrderService ~ getOrderByUserId ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }


  // ============================================
  //               POST ORDER
  // ============================================
  async postOrder(body: CreateOrderDto, res: Response) {
    try {
      let { ho_ten, email, dia_chi, so_dien_thoai, san_pham } = body

      let checkUserPhone = await this.model.nguoiDung.findFirst({
        where: {
          so_dien_thoai,
          isDelete: false
        },
      });

      if (checkUserPhone === null) {
        // Tạo một người dùng mới nếu số điện thoại không tồn tại
        await this.model.nguoiDung.create({
          data: {
            vai_tro_id: 3,
            ho_ten,
            email,
            mat_khau: '',
            dia_chi,
            so_dien_thoai
          },
        });
      }

      let data = await this.model.donHang.create({
        data: body
      })

      // Thêm từng chi tiết đơn hàng vào bảng chi tiết đơn hàng
      for (const sp of san_pham) {
        await this.model.chiTietDonHang.create({
          data: {
            don_hang_id: data.don_hang_id,
            san_pham_id: sp.san_pham_id,
            so_luong: sp.so_luong,
            don_gia: sp.don_gia
          }
        })
      }

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
  // async putOrderById(orderID: number, body: CreateOrderDto, res: Response) {
  //   try {

  //     let checkOrder = await this.model.donHang.findFirst({
  //       where: {
  //         don_hang_id: +orderID,
  //         isDelete: false
  //       }
  //     });

  //     if (checkOrder === null) {
  //       return failCode(res, checkOrder, 400, "Không tìm thấy đơn hàng, vui lòng kiểm tra lại thông tin")
  //     }

  //     let data = await this.model.donHang.update({
  //       where: {
  //         don_hang_id: +orderID
  //       },
  //       data: body
  //     })

  //     successCode(res, data, 200, "Cập nhật đơn hàng thành công !")
  //   }
  //   catch (exception) {
  //     console.log("🚀 ~ file: order.service.ts:188 ~ OrderService ~ putOrderById ~ exception:", exception);
  //     errorCode(res, "Lỗi BE")
  //   }
  // }

  // ============================================
  //                DELETE ORDER  
  // ============================================
  async deleteOrderById(id: number, res: Response) {
    try {
      let data = await this.model.donHang.findFirst({
        where: {
          don_hang_id: +id,
          isDelete: false
        },
      });

      if (data === null) {
        return failCode(res, data, 400, "Đơn hàng ID không tồn tại hoặc đã bị xóa trước đó !")
      }

      await this.model.donHang.update({
        where: {
          don_hang_id: +id,
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
