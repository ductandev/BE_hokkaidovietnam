import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';


import { successCode, failCode, errorCode } from 'src/Config/response';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private jwtService: JwtService) { }

  model = new PrismaClient();

  // ============================================
  //            GET ALL CART
  // ============================================ 
  async getAll(req: Request, res: Response) {
    try {
      // ------------------- CHECK TOKEN---------------------
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return failCode(res, '', 401, 'Yêu cầu token!');
      }
      const user = this.jwtService.verify(token);
      let nguoi_dung_id = +user.data.nguoi_dung_id
      // ----------------------------------------------------

      let data = await this.model.gioHang.findMany({
        where: {
          nguoi_dung_id,
          isDelete: false,
        },
        include: {
          SanPham: true
        }
      });

      const sanPhamArray = data.map(item => ({
        ...item.SanPham,
        so_luong: item.so_luong
      })).reverse();

      if (data.length === 0) {
        return successCode(res, sanPhamArray, 200, "Người dùng chưa thêm sản phẩm vào giỏ hàng !")
      }

      successCode(res, sanPhamArray, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: cart.service.ts:32 ~ CartService ~ getAll ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  };

  // ============================================
  //         GET CART BY USER ID
  // ============================================ 
  async getCartByUserId(userID: number, res: Response) {
    try {
      let data = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id: +userID,
          isDelete: false,
        },
        include: {
          GioHang: {
            include: {
              SanPham: true
            }
          }

        }
      });

      if (data === null) {
        return failCode(res, '', 400, "Người dùng id không tồn tại")
      }

      if (data.GioHang.length === 0) {
        return successCode(res, data, 200, "Người dùng này chưa thêm sản phẩm nào !")
      }

      successCode(res, data, 200, "Thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: cart.service.ts:67 ~ CartService ~ getCartByUserId ~ exception:", exception);
      errorCode(res, "Lỗi BE !")
    }
  };



  // ============================================
  //                 POST CART
  // ============================================
  async postCart(req: Request, body: CreateCartDto, res: Response) {
    try {
      // -------------------TOKEN----------------------------
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return failCode(res, '', 401, 'Yêu cầu token!');
      }
      const user = this.jwtService.verify(token);
      let nguoi_dung_id = +user.data.nguoi_dung_id
      // -----------------------------------------------------

      let { san_pham_id, so_luong } = body;

      // ****************************************************
      // CHECK USER ID CÓ TỒN TẠI HAY KHÔNG 
      let checkUserID = await this.model.nguoiDung.findFirst({
        where: {
          nguoi_dung_id,
          vai_tro_id: 2,
          isDelete: false
        }
      });

      if (checkUserID === null) {
        return failCode(res, '', 400, "Người dùng ID không tồn tại !")
      }

      // CHECK SẢN PHẨM ID CÓ TỒN TẠI HAY KHÔNG 
      let checkProductID = await this.model.sanPham.findFirst({
        where: {
          san_pham_id,
          isDelete: false
        }
      });

      if (checkProductID === null) {
        return failCode(res, '', 400, "Sản phẩm ID không tồn tại !")
      }
      // ****************************************************


      let checkCart = await this.model.gioHang.findFirst({
        where: {
          nguoi_dung_id,
          san_pham_id,
          isDelete: false
        }
      })

      if (checkCart === null && so_luong === 0) {
        return failCode(res, '', 400, "Số lượng sản phẩm phải lớn hơn 0 !")
      }


      if (checkCart === null && so_luong > 0) {
        await this.model.gioHang.create({
          data: {
            nguoi_dung_id,
            san_pham_id,
            so_luong
          }
        })
        return successCode(res, body, 201, "Thêm giỏ hàng thành công !")
      }


      if (checkCart && so_luong === 0) {
        await this.model.gioHang.delete({
          where: {
            gio_hang_id: checkCart.gio_hang_id
          }
        })
        return successCode(res, body, 200, "Xóa sản phẩm thành công !")
      }


      let update = await this.model.gioHang.update({
        where: {
          gio_hang_id: checkCart.gio_hang_id,
          nguoi_dung_id,
          san_pham_id,
          isDelete: false
        },
        data: {
          so_luong: checkCart.so_luong + so_luong
        }
      })

      successCode(res, update, 201, "Cập nhật giỏ hàng thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: cart.service.ts:116 ~ CartService ~ postCart ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }

  // ============================================
  //                 PUT CART
  // ============================================
  async putCart(req: Request, body: CreateCartDto, res: Response) {
    try {
      // -------------------TOKEN----------------------------
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return failCode(res, '', 401, 'Yêu cầu token!');
      }
      const user = this.jwtService.verify(token);
      let nguoi_dung_id = +user.data.nguoi_dung_id
      // ---------------------------------------------------

      let { san_pham_id, so_luong } = body;

      let checkCartID = await this.model.gioHang.findFirst({
        where: {
          nguoi_dung_id,
          san_pham_id,
          isDelete: false
        }
      });


      if (checkCartID === null) {
        return failCode(res, '', 400, "Không tìm thấy người dùng ID và sản phẩm này !")
      }

      let update = await this.model.gioHang.update({
        where: {
          gio_hang_id: checkCartID.gio_hang_id,
          nguoi_dung_id,
          san_pham_id
        }, data: {
          so_luong
        }
      })
      successCode(res, update, 200, "Thành công !")
    }
    catch (error) {
      console.log("🚀 ~ file: cart.service.ts:226 ~ CartService ~ putCart ~ error:", error);
      errorCode(res, "Lỗi BE")
    }
  }
  // ============================================
  //               DELETE CART 
  // ============================================
  async deleteCart(req: Request, id: number, res: Response) {
    try {
      // -------------------TOKEN----------------------------
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return failCode(res, '', 401, 'Yêu cầu token!');
      }
      const user = this.jwtService.verify(token);
      let nguoi_dung_id = +user.data.nguoi_dung_id
      // ------------------------------------------------------

      let checkCartID = await this.model.gioHang.findFirst({
        where: {
          nguoi_dung_id,
          san_pham_id: +id,
          isDelete: false
        }
      });

      if (checkCartID === null) {
        return failCode(res, '', 400, "Sản phẩm không có trong giỏ hàng để xóa !")
      }

      await this.model.gioHang.delete({
        where: {
          gio_hang_id: checkCartID.gio_hang_id
        }
      });

      successCode(res, checkCartID, 200, "Xóa sản phẩm giỏ hàng ID thành công !")
    }
    catch (exception) {
      console.log("🚀 ~ file: cart.service.ts:191 ~ CartService ~ deleteCart ~ exception:", exception);
      errorCode(res, "Lỗi BE")
    }
  }
}
