import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Response } from 'express';
import { errorCode, failCode, successCode, successCodeProduct } from 'src/Config/response';
import { CreateOrderDto, UpdateOrderDto } from './dto/create-order.dto';


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
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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
  //      GET ALL ORDER PAGINATION BY SEARCH NAME
  // ============================================
  async getAllPagination(typeID: number, pageIndex: number, pageSize: number, ho_ten: string, dia_chi: string, phuong_id: string, quan_id: string, tinh_thanh_id: string, so_dien_thoai: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            ho_ten: { contains: ho_ten },
            dia_chi: { contains: dia_chi },
            phuong_id: { contains: phuong_id },
            quan_id: { contains: quan_id },
            tinh_thanh_id: { contains: tinh_thanh_id },
            so_dien_thoai: { contains: so_dien_thoai },
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
            ho_ten: { contains: ho_ten },
            dia_chi: { contains: dia_chi },
            phuong_id: { contains: phuong_id },
            quan_id: { contains: quan_id },
            tinh_thanh_id: { contains: tinh_thanh_id },
            so_dien_thoai: { contains: so_dien_thoai },
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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
          ho_ten: { contains: ho_ten },
          dia_chi: { contains: dia_chi },
          phuong_id: { contains: phuong_id },
          quan_id: { contains: quan_id },
          tinh_thanh_id: { contains: tinh_thanh_id },
          so_dien_thoai: { contains: so_dien_thoai },
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
          ho_ten: { contains: ho_ten },
          dia_chi: { contains: dia_chi },
          phuong_id: { contains: phuong_id },
          quan_id: { contains: quan_id },
          tinh_thanh_id: { contains: tinh_thanh_id },
          so_dien_thoai: { contains: so_dien_thoai },
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY ADDRESS
  // =====================================================
  async getAllPaginationAddress(typeID: number, pageIndex: number, pageSize: number, search: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            dia_chi: {
              contains: search   // LIKE '%nameProduct%'
            },
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy địa chỉ này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            dia_chi: {
              contains: search   // LIKE '%nameProduct%'
            },
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          dia_chi: {
            contains: search   // LIKE '%nameProduct%'
          },
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          dia_chi: {
            contains: search   // LIKE '%nameProduct%'
          },
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY WARD
  // =====================================================
  async getAllPaginationWard(typeID: number, pageIndex: number, pageSize: number, phuong_id: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            phuong_id,
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy phường ID này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            phuong_id,
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          phuong_id,
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          phuong_id,
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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

  // =====================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY DISSTRICT
  // =====================================================
  async getAllPaginationDistrict(typeID: number, pageIndex: number, pageSize: number, quan_id: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            quan_id,
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy quận ID này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            quan_id,
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          quan_id,
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          quan_id,
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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

  // =======================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY PROVINCE
  // =======================================================
  async getAllPaginationProvince(typeID: number, pageIndex: number, pageSize: number, tinh_thanh_id: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            tinh_thanh_id,
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy dữ liệu tỉnh thành ID này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            tinh_thanh_id,
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          tinh_thanh_id,
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          tinh_thanh_id,
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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

  // =======================================================
  // GET ALL ORDER PAGINATION BY TYPE_ID SEARCH BY PHONE
  // =======================================================
  async getAllPaginationPhone(typeID: number, pageIndex: number, pageSize: number, so_dien_thoai: string, res: Response) {
    try {
      if (pageIndex <= 0 || pageSize <= 0) {
        return failCode(res, '', 400, "page và limit phải lớn hơn 0 !")
      }

      let index = (pageIndex - 1) * pageSize;

      if (+typeID === 0) {
        let total = await this.model.donHang.findMany({
          where: {
            so_dien_thoai: {
              contains: so_dien_thoai
            },
            isDelete: false
          }
        });

        if (total.length === 0) {
          return successCode(res, total, 200, "Không tìm thấy người dùng có số điện thoại này !")
        }

        let data = await this.model.donHang.findMany({
          skip: +index,     // Sử dụng skip thay vì offset
          take: +pageSize,  // Sử dụng take thay vì limit
          where: {
            so_dien_thoai: {
              contains: so_dien_thoai
            },
            isDelete: false
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });

        if (data.length === 0) {
          return successCodeProduct(res, data, 200, total.length, "Không có dữ liệu số điện thoại được tìm thấy")
        }

        return successCodeProduct(res, data, 200, total.length, "Thành công !")
      }

      let total = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: +typeID,
          so_dien_thoai: {
            contains: so_dien_thoai
          },
          isDelete: false
        }
      });

      if (total.length === 0) {
        return successCode(res, total, 200, "Không có dữ liệu số điện thoại được tìm thấy !")
      }

      let data = await this.model.donHang.findMany({
        skip: +index,     // Sử dụng skip thay vì offset
        take: +pageSize,  // Sử dụng take thay vì limit
        where: {
          so_dien_thoai: {
            contains: so_dien_thoai
          },
          trang_thai_don_hang_id: +typeID,
          isDelete: false
        },
        orderBy: {
          don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
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
  //            GET ALL ORDER SUMARY
  // ============================================
  async getOrderSummary(res: Response) {
    try {
      const moment = require('moment-timezone');

      const firstDayOfMonth = moment().startOf('month').format();
      const lastDayOfMonth = moment().endOf('month').format();
      console.log("🚀 firstDayOfMonth ", firstDayOfMonth);
      console.log("🚀 lastDayOfMonth ", lastDayOfMonth)

      const totalOrderStatusDone = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: 4,
          isDelete: false
        }
      });

      const totalOderOnMonth = await this.model.donHang.findMany({
        where: {
          trang_thai_don_hang_id: 4,
          isDelete: false,
          thoi_gian_dat_hang: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth
          }
        }
      })

      // Tính tổng số tiền của tất cả đơn hàng hoàn thành
      const nestSaleSummary = totalOrderStatusDone.reduce((total, item) => total + item.tong_tien || 0, 0);
      // Tính tổng số tiền của những đơn hàng hoàn thành trong tháng
      const nestSaleOfMonth = totalOderOnMonth.reduce((total, item) => total + item.tong_tien || 0, 0);

      const content = {
        totalOrderStatusDone: totalOrderStatusDone.length,
        totalOderOnMonth: totalOderOnMonth.length,
        nestSaleOfMonth,
        nestSaleSummary
      }

      successCode(res, content, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:188 ~ OrderService ~ getOrderSummary ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //            GET ALL ORDER SUMARY
  // ============================================
  async getOrderSuccessExcel(startDate: string, endDate: string, res: Response) {
    try {
      let orders: any[];
      if (startDate === '' && endDate === '') {
        orders = await this.model.donHang.findMany({
          where: {
            trang_thai_don_hang_id: 4,
            isDelete: false,
          },
          include: {
            ChiTietDonHang: {
              include: {
                SanPham: true
              }
            },
            HinhThucThanhToan: true,
            TrangThaiDonHang: true,
            NguoiDung: true
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });
      } else {
        orders = await this.model.donHang.findMany({
          where: {
            trang_thai_don_hang_id: 4,
            isDelete: false,
            thoi_gian_dat_hang: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            ChiTietDonHang: {
              include: {
                SanPham: true
              }
            },
            HinhThucThanhToan: true,
            TrangThaiDonHang: true,
            NguoiDung: true
          },
          orderBy: {
            don_hang_id: 'desc'   // Đảm bảo lấy dữ liệu mới nhất trước
          }
        });
      }

      // Tạo object mới với các thông tin cần thiết
      const orderSummary = orders.map(order => ({
        ma_don_hang: order.don_hang_id,
        ho_ten: order.ho_ten,
        gmail: order.email,
        so_dien_thoai: order.so_dien_thoai,
        dia_chi: order.dia_chi,
        phuong_id: order.phuong_id,
        quan_id: order.quan_id,
        tinh_thanh_id: order.tinh_thanh_id,
        thoi_gian_dat_hang: order.thoi_gian_dat_hang,
        hinh_thuc_thanh_toan: order.HinhThucThanhToan.ten_hinh_thuc_thanh_toan,
        tong_tien: order.tong_tien
      }));

      return successCode(res, orderSummary, 200, "Thành công !");
    } catch (exception) {
      console.log("🚀 ~ file: order.service.ts:646 ~ OrderService ~ getOrderSuccessExcel ~ exception:", exception);
      errorCode(res, "Lỗi BE");
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
          ChiTietDonHang: {
            include: {
              SanPham: true
            }
          },
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
  //         GET ORDER BY USER PHONE
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
        return failCode(res, checkUserPhone, 400, "Số điện thoại người dùng không tồn tại !")
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
      const { ho_ten, email, dia_chi, phuong_id, quan_id, tinh_thanh_id, so_dien_thoai, san_pham, hinh_thuc_thanh_toan_id, ma_giam_gia, tong_tien } = body
      const { nguoi_dung_id, ...bodyNoUserID } = body

      bodyNoUserID.thoi_gian_dat_hang = new Date();
      bodyNoUserID.thoi_gian_dat_hang.setHours(bodyNoUserID.thoi_gian_dat_hang.getHours() + 7)

      bodyNoUserID.hinh_thuc_thanh_toan_id = +hinh_thuc_thanh_toan_id

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
            phuong_id,
            quan_id,
            tinh_thanh_id,
            so_dien_thoai
          },
        });
      }


      let tongTienTinhDuoc = 0;

      // Kiểm tra số lượng sản phẩm trong kho trước khi tạo đơn hàng
      for (const sp of san_pham) {
        const product = await this.model.sanPham.findFirst({
          where: {
            san_pham_id: sp.san_pham_id,
            gia_ban: sp.don_gia,
            isDelete: false
          }
        });

        if (!product) {
          return failCode(res, product, 400, `Sản phẩm ID ${sp.san_pham_id} hoặc đơn giá không tồn tại.`);
        }

        if (product.so_luong_trong_kho < sp.so_luong) {
          return failCode(res, product, 400, `Số lượng sản phẩm ${product.ten_san_pham} không đủ.`);
        }

        tongTienTinhDuoc += sp.so_luong * sp.don_gia;
      }

      // Kiểm tra xem Mã giảm giá có tồn tại hay không, nếu không nhập mã giảm thì sẽ không giảm giá.
      let tiLeGiamGia = 0;
      if (ma_giam_gia) {
        let checkVoucher = await this.model.maGiam.findFirst({
          where: {
            ma_giam_gia,
            isDelete: false
          }
        });

        if (checkVoucher) {
          tiLeGiamGia = checkVoucher.cu_the;
        }
      }

      // Áp dụng giảm giá
      tongTienTinhDuoc = tongTienTinhDuoc - (tongTienTinhDuoc * tiLeGiamGia) / 100 + 30;  // Cộng 30k phí ship mặc định

      // Kiểm tra tổng tiền FE gửi lên và tổng tiền BE tính được có khớp không
      if (tong_tien !== tongTienTinhDuoc) {
        return failCode(res, '', 400, "Tổng tiền không hợp lệ !");
      }


      // Tạo đơn hàng
      let data = await this.model.donHang.create({
        data: bodyNoUserID
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

        const updateOldQuantity = await this.model.sanPham.findFirst({
          where: {
            san_pham_id: sp.san_pham_id,
            isDelete: false
          }
        });

        const newQuantity = updateOldQuantity.so_luong_trong_kho - sp.so_luong;

        // Cập nhật số lượng sản phẩm trong kho
        await this.model.sanPham.update({
          where: {
            san_pham_id: sp.san_pham_id,
            isDelete: false
          },
          data: {
            so_luong_trong_kho: newQuantity,
            trang_thai_san_pham: newQuantity === 0 ? false : updateOldQuantity.trang_thai_san_pham
          }
        });

        // Xóa giỏ hàng sau khi đặt hàng
        if (checkUserPhone.vai_tro_id !== 3 && nguoi_dung_id) {
          const findCart = await this.model.gioHang.findFirst({
            where: {
              nguoi_dung_id: +nguoi_dung_id,
              san_pham_id: sp.san_pham_id,
              so_luong: sp.so_luong,
              isDelete: false
            }
          });

          if (findCart) {
            await this.model.gioHang.delete({
              where: findCart
            })
          }
        }
      }

      successCode(res, data, 200, "Thêm đơn hàng mới thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: order.service.ts:156 ~ OrderService ~ postOrder ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //               PATCH ORDER
  // ============================================
  async putOrderById(orderID: number, body: UpdateOrderDto, res: Response) {
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
